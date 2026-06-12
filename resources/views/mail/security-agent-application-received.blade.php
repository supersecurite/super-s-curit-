<x-mail::message>
# Nouvelle candidature

**Nom :** {{ $application['full_name'] }}

**Téléphone :** {{ $application['phone'] }}

@if (! empty($application['email']))
**E-mail :** {{ $application['email'] }}
@endif

@if (! empty($application['post_label']))
**Poste :** {{ $application['post_label'] }}
@endif

@if (! empty($application['experience_years']))
**Expérience :** {{ $application['experience_years'] }} an(s)
@endif

@if (! empty($application['availability_label']))
**Disponibilité :** {{ $application['availability_label'] }}
@endif

**Localisation :** {{ $application['location_summary'] }}

@if (! empty($application['address_detail']))
**Adresse complémentaire :** {{ $application['address_detail'] }}
@endif

@if (! empty($application['certifications']))
**Certifications :**

{{ $application['certifications'] }}
@endif

@if (! empty($application['motivation']))
**Motivation :**

{{ $application['motivation'] }}
@endif

</x-mail::message>
