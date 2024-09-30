

# def adiec_exp_score(instance):
#     all_exp = instance.exp.all()
#     score = 0

#     for each_exp in all_exp:
#         total += each_exp.year

#     score = total * 7

#     return 20 if score >= 20 else score


# def get_score_adiec(ug, pg, phd=0):

#     if pg >= 3:
#         return 20
#     elif pg == 2:
#         return 13
#     elif pg == 1:
#         return 7
#     else:
#         return 0


from decimal import Decimal, ROUND_HALF_UP

def get_score_adiec(ug, pg, phd=0):
    total = 0
    onemonthpg = Decimal(0.556)
    
    
    if pg > 0:
        totalmonth = Decimal(pg) * Decimal(12)
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total += onemonthpg * totalmonth
    else:
        total += 0

    return total