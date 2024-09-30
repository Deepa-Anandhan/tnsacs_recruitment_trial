from django.db import models
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Job

from django.db import models
from django.db.models.signals import post_save
from .models import Job
from superadmin.api.utiils import generate_unique_random_number
from .models import Experience
from .ScoreValidatorJobs.cpm import get_score_cpm
from .ScoreValidatorJobs.cso import get_score_cso
from .ScoreValidatorJobs.dmdo import get_score_dmdo
from .ScoreValidatorJobs.ddls import get_score_ddls
# from .ScoreValidatorJobs.ddsi import get_score_ddsi
from .ScoreValidatorJobs.adictc import get_score_adictc
from .ScoreValidatorJobs.adti import get_score_adti
from .ScoreValidatorJobs.adiec import get_score_adiec
from .ScoreValidatorJobs.cpo import get_score_cpo  ,CPO_VALUE
from .ScoreValidatorJobs.spo import get_score_spo , SPO_VALUE
from django.dispatch import Signal

ABBREVIATION_POSITIONS = {
    Job.POSITION.CLUSTER_MANAGER: get_score_cpm,
    Job.POSITION.CLINICAL_OFFICER: get_score_cso,
    Job.POSITION.DATA_MONITORING_OFFICER: get_score_dmdo,
    Job.POSITION.DEPUTY_LS_DIRECTOR: get_score_ddls,
    # Job.POSITION.DEPUTY_SI_DIRECTOR: get_score_ddsi,
    Job.POSITION.ASSISTANT_ICTC_DIRECTOR: get_score_adictc,
    Job.POSITION.ASSISTANT_TI_DIRECTOR: get_score_adti,
    Job.POSITION.ASSISTANT_IEC_DIRECTOR: get_score_adiec,
    # Job.POSITION.STATE_PREVENTION_OFFICER : get_score_spo,
    # Job.POSITION.CLUSTER_PREVENTION_OFFICER : get_score_cpo
}


def get_score(ug, pg, phd, position):

    return ABBREVIATION_POSITIONS[position](ug, pg, phd)


# Define the abbreviation dictionary
ABBREVIATION_POSITION = {
    Job.POSITION.CLUSTER_MANAGER: 'CPM',
    Job.POSITION.CLINICAL_OFFICER: 'CSO',
    Job.POSITION.DATA_MONITORING_OFFICER: 'DMDO',
    Job.POSITION.DEPUTY_LS_DIRECTOR: 'DDLS',
    # Job.POSITION.DEPUTY_SI_DIRECTOR: 'DDSI',
    Job.POSITION.ASSISTANT_ICTC_DIRECTOR: 'ADICTC',
    Job.POSITION.ASSISTANT_TI_DIRECTOR: 'ADTI',
    Job.POSITION.ASSISTANT_IEC_DIRECTOR: 'ADIEC',
}

my_custom_signal = Signal()



@receiver(my_custom_signal)
def my_custom_signal_receiver(sender, **kwargs):
    instance = kwargs.get('instance')

    # Calculate percentages for educational qualifications
    sslc_percentage = (instance.sslc.percentage / 10) if instance.sslc else 0
    hsc_percentage = (instance.hsc.percentage / 5) if instance.hsc else 0
    ug_percentage = (instance.ug.percentage / 100) * 30 if instance.ug else 0
    
    # Calculate PG percentage
    pg_percentage = 0
    pg_count = instance.pg.count()
    if pg_count > 0:
        pg_total_percentage = sum(pg.percentage for pg in instance.pg.all())
        pg_percentage = ((pg_total_percentage / pg_count) /100) * 10
    
    # Initialize experience years
    exp_total_years_ug = exp_total_years_pg = exp_total_years_phd = 0
    
    # Fetch all experiences once to reduce database hits
    experiences = instance.exp.all()

    if instance.position in {Job.POSITION.STATE_PREVENTION_OFFICER, Job.POSITION.CLUSTER_PREVENTION_OFFICER}:
        exp_total_years_pg = sum(
            exps.year for exps in experiences
            if exps.course == Experience.Course.PG and (exps.degree == CPO_VALUE or exps.degree == SPO_VALUE)
        )
        additional_years_pg = sum(
            exps.year for exps in experiences
            if exps.course == Experience.Course.PG and not (exps.degree == CPO_VALUE or exps.degree == SPO_VALUE)
        )
        exp_percentage = get_score(
            exp_total_years_ug, exp_total_years_pg, additional_years_pg, instance.position
        )
        exp_percentage = min(exp_percentage, 30)  # Capping to 30
    else:
        for exps in experiences:
            if exps.course == Experience.Course.UG:
                exp_total_years_ug += exps.year
            elif exps.course == Experience.Course.PG:
                exp_total_years_pg += exps.year
            elif exps.course == Experience.Course.PHD:
                exp_total_years_phd += exps.year
        
        exp_percentage = get_score(
            exp_total_years_ug, exp_total_years_pg, exp_total_years_phd, instance.position
        )
        exp_percentage = min(exp_percentage, 20)  # Capping to 20

    # Print debug information
    print(sslc_percentage, hsc_percentage, ug_percentage, pg_percentage, exp_percentage)

    # Calculate total mark
    mark = sslc_percentage + hsc_percentage + ug_percentage + pg_percentage + exp_percentage

    # Add additional marks if preferred experience exists
    if instance.position not in {Job.POSITION.STATE_PREVENTION_OFFICER, Job.POSITION.CLUSTER_PREVENTION_OFFICER} and instance.pexp.exists():
        mark += 10

    # Set and save the calculated mark to the Job instance
    instance.mark = mark
    instance.save()



@receiver(post_save, sender=Job)
def calculate_mark_and_application_id(sender, instance, created,  **kwargs):

    if created:
        random_number = generate_unique_random_number()
        instance.application_id = f"TAN{random_number}"
        instance.save()

