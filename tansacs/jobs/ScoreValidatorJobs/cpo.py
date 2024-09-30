CPO_VALUE = 'HIV/AIDS as supervisor'

from decimal import Decimal, ROUND_HALF_UP

def get_score_cpo(ug, pg, phd=0):
    onemonth = Decimal(0.5 )  # Define as Decimal
    total = Decimal(0)  # Initialize total as Decimal
    if pg > 0:
        totalmonth = Decimal(pg) * Decimal(12)  # Ensure totalmonth is Decimal
        # Round totalmonth to the nearest whole number
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total = onemonth * totalmonth  # Multiplying two Decimals now
        if total > Decimal(18):
            total = Decimal(18)
    if phd > 0:
        totalmonth = Decimal(phd) * Decimal(12)  # Ensure totalmonth is Decimal
        # Round totalmonth to the nearest whole number
        totalmonth = totalmonth.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        total += onemonth * totalmonth  # Multiplying two Decimals now
    return total

    
