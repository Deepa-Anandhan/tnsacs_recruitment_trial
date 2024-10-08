

# adti_degree = {


#     'pg': ['Master of Science (M.Sc.)', 'Master of Surgery (M.S.)', 'Master of Pharmacy (M.Pharm)',
#            'Master of Architecture (M.Arch)', 'Master of Social Work (MSW)', 'Master of Science in Nursing (M.Sc. Nursing)',
#            'Master of Public Health (MPH)', 'Master of Philosophy (M.Phil.)'],
#     'ug':  'Bachelor of Medicine, Bachelor of Surgery (MBBS)'

# }


# def adti_exp_score(instance):
#     all_exp = instance.exp.all()
#     score = 0

#     if instance.pg.filter(degree__in=adti_degree['pg']).exists() and instance.ug.degree == adti_degree['ug']:

#         total = 0
#         for each_exp in all_exp:
#             total += each_exp.year

#         score = total * 7

#     return 20 if score >= 20 else score


# def get_score_adti(ug, pg, phd=0):

#     if pg >= 3:
#         return 20
#     elif pg == 2:
#         return 13
#     elif pg == 1:
#         return 7
#     else:
#         return 0


from decimal import Decimal, ROUND_HALF_UP

def get_score_adti(ug, pg, phd=0):
    total = 0
    onemonthpg = Decimal(0.556)

    
    
    if pg > 0:
        totalmonth = Decimal(pg) * Decimal(12)
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total += onemonthpg * totalmonth
    else:
        total += 0

    return total