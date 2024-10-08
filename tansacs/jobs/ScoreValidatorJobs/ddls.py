# ddls_degree = {
#     5: {'pg': ['Master of Science (M.Sc.)', 'B.tech']},
#     3: {'ug': ['Medical or Allied Health Sciences'], 'pg': ['Social Science', 'Psychology', 'Statistics', 'Population Sciences']}
# }

# required_exp1 = 'medical diagnostic laboratory'
# required_exp2 = 'accredited labs'


# def ddls_exp_score(instance):
#     print(instance.ug, instance.pg.all)
#     all_exp = instance.exp.all()

#     score = 0
#     print("all", all_exp)
#     # Check if the user has the required experience
#     if all_exp.filter(degree__icontains=required_exp1, year__gte=3).exists() or all_exp.filter(degree__icontains=required_exp2, year__gte=3).exists():
#         # Check if the user's undergraduate degree is in the specified list

#         total = 0
#         for each_exp in all_exp:
#             if each_exp.degree == required_exp1 or each_exp.degree == required_exp2:
#                 total += each_exp.year

#         score = total * 7

#     if instance.pg.filter(degree__in=ddls_degree[1]['pg']).exists():
#         print("fourth pass")
#         total = 0
#         for each_exp in all_exp:

#             total += each_exp.year

#         score = total * 4

#     return 20 if score >= 20 else score


# def get_score_ddls(ug, pg, phd=0):

#     total = 0
#     if pg > 0:
#         total += (pg * 4)

#     if phd >= 3:
#         total += 20
#     elif phd == 2:
#         total += 13
#     elif phd == 1:
#         total += 7
#     else:
#         total += 0

#     total += (ug * 4)

#     return total



from decimal import Decimal, ROUND_HALF_UP

def get_score_ddls(ug, pg, phd=0):
    total = 0
    onemonthphd = Decimal(0.556)
    onemonthug = Decimal(.334)
    onemonthpg = Decimal(.334)

    
    
    if phd > 0:
        totalmonth = Decimal(phd) * Decimal(12)
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total += onemonthphd * totalmonth

    if ug > 0:
        totalmonth = Decimal(ug) * Decimal(12)
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total += onemonthug * totalmonth
    if pg > 0:
        totalmonth = Decimal(pg) * Decimal(12)
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total += onemonthpg * totalmonth
    else:
        total += 0

    return total
