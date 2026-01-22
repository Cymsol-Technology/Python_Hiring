import json
from datetime import datetime
from decimal import Decimal

from django.db import transaction
from django.db.models import Sum
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from accounts.jwt_auth import require_jwt  
from vessel_data.models import Vessel_Data
from masters.models import Master_Vessels, Master_hscode


# def _is_admin(request):
#     return getattr(request, "role", None) == "admin"


@require_jwt
def vessels_list(request):
    vessels = Master_Vessels.objects.filter(is_deleted=False, is_active=True)

    data = [
        {
            "id": str(v.id),
            "vessel_name": v.vessel_name,
            "vessel_code": v.vessel_code,
            "imo_number": v.imo_number,
            "dead_weight": v.dead_weight,
        }
        for v in vessels
    ]

    return JsonResponse({"vessels": data}, status=200)




@require_jwt
def vessel_data_view(request):
    vessel_name = request.GET.get('vessel')
    start = request.GET.get('start')
    end = request.GET.get('end')

    qs = Vessel_Data.objects.select_related('vessel', 'hscode').filter(
        is_deleted=False, is_active=True
    )

    if vessel_name:
        qs = qs.filter(vessel__vessel_name=vessel_name)

    if start:
        try:
            start_d = datetime.strptime(start, "%Y-%m-%d").date()
            qs = qs.filter(market_date__gte=start_d)
        except ValueError:
            pass

    if end:
        try:
            end_d = datetime.strptime(end, "%Y-%m-%d").date()
            qs = qs.filter(market_date__lte=end_d)
        except ValueError:
            pass

    qs = qs.order_by('market_date')

    data = []
    for r in qs:
        data.append({
            'id': str(r.id),  # ✅ Include record ID here
            'date': r.market_date.isoformat(),
            'hire_rate': float(r.hire_rate) if r.hire_rate is not None else None,
            'market_rate': float(r.market_rate) if r.market_rate is not None else None,
            'code': r.hscode.code if r.hscode else None,
            'description': r.hscode.description if r.hscode else None,
            'vessel_name': r.vessel.vessel_name if r.vessel else None,
            'vessel_code': r.vessel.vessel_code if r.vessel else None,
            'dead_weight': r.vessel.dead_weight if r.vessel else None,
            'imo_no': r.vessel.imo_number if r.vessel else None,
        })

    return JsonResponse({'data': data}, status=200)



@require_jwt
def admin_aggregate(request):
    start = request.GET.get('start')
    end = request.GET.get('end')

    qs = Vessel_Data.objects.select_related('hscode').filter(
        is_deleted=False, is_active=True
    )

    # Apply filters if start/end provided
    if start:
        try:
            start_d = datetime.strptime(start, "%Y-%m-%d").date()
            qs = qs.filter(market_date__gte=start_d)
        except ValueError:
            pass

    if end:
        try:
            end_d = datetime.strptime(end, "%Y-%m-%d").date()
            qs = qs.filter(market_date__lte=end_d)
        except ValueError:
            pass

    # Aggregate
    agg = (
        qs.values('market_date', 'hscode__id', 'hscode__code', 'hscode__description')
        .annotate(
            total_hire=Sum('hire_rate'),
            total_market=Sum('market_rate')
        )
        .order_by('-market_date')  # Sort descending to get latest first
    )

    #  If no filters applied → only return 30 latest records
    if not start and not end:
        agg = agg[:30]

    # Convert to list for JSON response
    data = []
    for r in agg:
        data.append({
            'date': r['market_date'].isoformat() if r.get('market_date') else None,
            'hscode_id': str(r.get('hscode__id')) if r.get('hscode__id') else None,
            'code': r.get('hscode__code'),
            'description': r.get('hscode__description'),
            'total_hire': float(r.get('total_hire')) if r.get('total_hire') is not None else 0.0,
            'total_market': float(r.get('total_market')) if r.get('total_market') is not None else 0.0,
        })

    # Optional: sort ascending again for frontend chart (oldest → newest)
    data.reverse()

    return JsonResponse({'data': data}, status=200)



@require_jwt
def vessel_data_list(request):
    # if not _is_admin(request):
    #     return JsonResponse({'detail': 'Forbidden'}, status=403)

    qs = Vessel_Data.objects.select_related('vessel', 'hscode') \
        .filter(is_deleted=False, is_active=True).order_by('market_date')

    data = []
    for r in qs:
        data.append({
            'id': str(r.id),
            'vessel_name': r.vessel.vessel_name if r.vessel else None,
            'imo_no': r.vessel.imo_number if r.vessel else None,
            'date': r.market_date.isoformat() if r.market_date else None,
            'hire_rate': float(r.hire_rate) if r.hire_rate is not None else None,
            'market_rate': float(r.market_rate) if r.market_rate is not None else None,
            'code': r.hscode.code if r.hscode else None,
            'description': r.hscode.description if r.hscode else None,
        })

    return JsonResponse({'data': data}, status=200)




@csrf_exempt
@require_jwt
def vessel_data_create(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    # if not _is_admin(request):
    #     return JsonResponse({'detail': 'Forbidden'}, status=403)

    try:
        body = json.loads(request.body.decode('utf-8'))
    except:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    vessel_name = body.get('vessel_name')
    date_str = body.get('date')
    hire_rate = body.get('hire_rate')
    market_rate = body.get('market_rate')
    code_val = body.get('code')
    desc_val = body.get('description')
    vessel_code = body.get('vessel_code')
    imo_no = body.get('imo_no')

    if not vessel_name or not date_str or hire_rate is None or market_rate is None or not code_val:
        return JsonResponse({'error': 'Missing required fields'}, status=400)

    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
    except:
        return JsonResponse({'error': 'Invalid date format, expected YYYY-MM-DD'}, status=400)

    try:
        hire_rate_dec = Decimal(str(hire_rate))
        market_rate_dec = Decimal(str(market_rate))
    except:
        return JsonResponse({'error': 'Invalid rate values'}, status=400)

    try:
        with transaction.atomic():
            try:
                vessel_obj = Master_Vessels.objects.get(vessel_name=vessel_name)
            except Master_Vessels.DoesNotExist:
                # Only create if it doesn't exist
                vessel_obj = Master_Vessels.objects.create(
                    vessel_name=vessel_name,
                    vessel_code=vessel_code or '',
                    imo_number=imo_no or ''
                )

            # Get or create HS code
            hscode_obj, created_hscode = Master_hscode.objects.get_or_create(
                code=code_val,
                defaults={'description': desc_val or ''}
            )

            if not created_hscode and desc_val and not hscode_obj.description:
                hscode_obj.description = desc_val
                hscode_obj.save(update_fields=['description', 'updated_at'])

            obj = Vessel_Data.objects.create(
                vessel=vessel_obj,
                market_date=date_obj,
                hire_rate=hire_rate_dec,
                market_rate=market_rate_dec,
                hscode=hscode_obj,
                created_by=getattr(request.user, 'id', None)
            )

        return JsonResponse({
            'id': str(obj.id),
            'vessel_name': vessel_obj.vessel_name,
            'vessel_code': vessel_obj.vessel_code,
            'imo_no': vessel_obj.imo_number,
            'date': obj.market_date.isoformat(),
            'hire_rate': float(obj.hire_rate),
            'market_rate': float(obj.market_rate),
            'code': hscode_obj.code,
            'description': hscode_obj.description
        }, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    



@csrf_exempt
@require_jwt
def vessel_data_update(request, pk):
    """
    Update an existing Vessel_Data record.
    """
    if request.method != "PUT":
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    # if not _is_admin(request):
    #     return JsonResponse({'detail': 'Forbidden'}, status=403)

    try:
        body = json.loads(request.body.decode('utf-8'))
    except:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    vessel_name = body.get('vessel_name')
    date_str = body.get('date')
    hire_rate = body.get('hire_rate')
    market_rate = body.get('market_rate')
    code_val = body.get('code')
    desc_val = body.get('description')
    vessel_code = body.get('vessel_code')
    imo_no = body.get('imo_no')

    try:
        obj = Vessel_Data.objects.select_related('vessel', 'hscode').get(pk=pk, is_deleted=False)
    except Vessel_Data.DoesNotExist:
        return JsonResponse({'error': 'Record not found'}, status=404)

    try:
        with transaction.atomic():
            # Parse and validate fields
            if date_str:
                try:
                    obj.market_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                except:
                    return JsonResponse({'error': 'Invalid date format, expected YYYY-MM-DD'}, status=400)

            if hire_rate is not None:
                try:
                    obj.hire_rate = Decimal(str(hire_rate))
                except:
                    return JsonResponse({'error': 'Invalid hire_rate value'}, status=400)

            if market_rate is not None:
                try:
                    obj.market_rate = Decimal(str(market_rate))
                except:
                    return JsonResponse({'error': 'Invalid market_rate value'}, status=400)

            # Handle vessel updates
            if vessel_name:
                vessel_obj, _ = Master_Vessels.objects.get_or_create(
                    vessel_name=vessel_name,
                    defaults={
                        'vessel_code': vessel_code or '',
                        'imo_number': imo_no or ''
                    }
                )
                # If the vessel already existed and updated details are provided
                if vessel_code and vessel_obj.vessel_code != vessel_code:
                    vessel_obj.vessel_code = vessel_code
                if imo_no and vessel_obj.imo_number != imo_no:
                    vessel_obj.imo_number = imo_no
                vessel_obj.save(update_fields=['vessel_code', 'imo_number'])
                obj.vessel = vessel_obj

            # Handle HS code updates
            if code_val:
                hscode_obj, created_hscode = Master_hscode.objects.get_or_create(
                    code=code_val,
                    defaults={'description': desc_val or ''}
                )
                if not created_hscode and desc_val and not hscode_obj.description:
                    hscode_obj.description = desc_val
                    hscode_obj.save(update_fields=['description', 'updated_at'])
                obj.hscode = hscode_obj

            obj.updated_by = getattr(request.user, 'id', None)
            obj.updated_at = datetime.now()
            obj.save()

        return JsonResponse({
            'id': str(obj.id),
            'vessel_name': obj.vessel.vessel_name if obj.vessel else None,
            'vessel_code': obj.vessel.vessel_code if obj.vessel else None,
            'imo_no': obj.vessel.imo_number if obj.vessel else None,
            'date': obj.market_date.isoformat(),
            'hire_rate': float(obj.hire_rate) if obj.hire_rate is not None else None,
            'market_rate': float(obj.market_rate) if obj.market_rate is not None else None,
            'code': obj.hscode.code if obj.hscode else None,
            'description': obj.hscode.description if obj.hscode else None,
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    


@require_jwt
def hscode_list(request):
    qs = Master_hscode.objects.filter(is_deleted=False, is_active=True)
    data = [
        {'id': str(h.id), 'code': h.code, 'description': h.description}
        for h in qs
    ]
    return JsonResponse({'hscodes': data}, status=200)







