# cso_degree = {
#     1: {'pg': ['Public Health', 'Healthcare Management', 'Healthcare Administration', 'Applied Epidemiology']},
#     3: {'ug': ['Medical or Allied Health Sciences'], 'pg': ['Social Science', 'Psychology', 'Statistics', 'Population Sciences']}
# }

# required_exp = 'HIV/AIDS'
# exp_field = 'Public Health'


# def cso_exp_score(instance):
#     print(instance.ug, instance.pg.all)
#     all_exp = instance.exp.all()

#     score = 0
#     print("all", all_exp)
#     # Check if the user has the required experience
#     if all_exp.filter(degree__icontains=required_exp, year__gte=1).exists():
#         # Check if the user's undergraduate degree is in the specified list
#         print("first_pass")
#         if instance.ug.degree in cso_degree[3]['ug']:
#             print("second pass")
#             # Check if the user has any of the postgraduate degrees listed
#             if instance.pg.filter(degree__in=cso_degree[3]['pg']).exists():
#                 print("third pass")
#                 # If all checks pass, calculate score (the calculation logic will depend on your requirements)
#                 # Assign a score based on your criteria
#                 total = 0
#                 for each_exp in all_exp:
#                     if each_exp.degree != required_exp:
#                         total += each_exp.year

#                 score = total * 7

#     if instance.pg.filter(degree__in=cso_degree[1]['pg']).exists():
#         print("fourth pass")
#         total = 0
#         for each_exp in all_exp:

#             total += each_exp.year

#         score = total * 20

#     return 20 if score >= 20 else score

    # def get_score_cso(ug, pg):

    #     if pg > 0:
    #         return 20

    #     return ug * 7


# def get_score_cso(ug, pg, phd=0):
#     total = 0
#     if pg > 0:
#         total += 20

#     if ug >= 3:
#         total += 20
#     elif ug == 2:
#         total += 13
#     elif ug == 1:
#         total += 7
#     else:
#         total += 0

#     return total

from decimal import Decimal, ROUND_HALF_UP

def get_score_cso(ug, pg, phd=0):
    total = 0
    onemonthug = Decimal(0.556)
    onemonthpg = Decimal(1.667)
    
    
    if pg > 0:
        totalmonth = Decimal(pg) * Decimal(12)
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total += onemonthpg * totalmonth

    if ug > 0:
        totalmonth = Decimal(ug) * Decimal(12)
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total += onemonthug * totalmonth
    else:
        total += 0

    return total

# onemonthug = 0.556
# oneyearug = '6.667'

# onemonthpg = 1.667


