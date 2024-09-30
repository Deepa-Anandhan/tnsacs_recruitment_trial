
SPO_VALUE = 'HIV-AIDS as managing prevention interventions with the core, bridge & vulnerable population'


from decimal import Decimal, ROUND_HALF_UP

def get_score_spo(ug, pg, phd=0):
    onemonth = Decimal(0.25)  # Define as Decimal
   
    total = Decimal(0)  # Initialize total as Decimal
    if pg > 0:
        totalmonth = Decimal(pg) * Decimal(12)  # Ensure totalmonth is Decimal
        # Round totalmonth to the nearest whole number
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total = onemonth * totalmonth  # Multiplying two Decimals now
        if total > Decimal(21):
            total = Decimal(21)
    if phd > 0:
        totalmonth = Decimal(phd) * Decimal(12)  # Ensure totalmonth is Decimal
        # Round totalmonth to the nearest whole number
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total += onemonth * totalmonth  # Multiplying two Decimals now
    return total
