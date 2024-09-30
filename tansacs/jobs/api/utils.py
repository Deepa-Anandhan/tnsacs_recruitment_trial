

def get_list_dict(validated_data, course, key=''):
    pg_data = []
    pgval = 0
    while True:

        data = {k.replace(f'{course}[{pgval}][', '').replace(
            ']', ''): v for k, v in validated_data.items() if k.startswith(f'{course}[{pgval}][')}

        if len(data) <= 0:
            break

        if course == "prefered_experience" and pgval >= 3:
            break

        if course == "prefered_experience" and not data[key]:
            data['company'] = ""

        print(data , course)
        are_all_keys_empty = all(value == '' or value == '0' or value == 'false' for value in data.values())

        if not are_all_keys_empty:
            pg_data.append(data)
        pgval += 1
    return pg_data
