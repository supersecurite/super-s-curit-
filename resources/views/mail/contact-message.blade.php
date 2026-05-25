<x-mail::message>
# Nouveau message de contact

**Nom :** {{ $contact['name'] }}

**E-mail :** {{ $contact['email'] }}

@if (! empty($contact['phone']))
**Téléphone :** {{ $contact['phone'] }}
@endif

@if (! empty($contact['company']))
**Entreprise :** {{ $contact['company'] }}
@endif

@if (! empty($contact['project_type']))
**Type de projet :** {{ $contact['project_type'] }}
@endif

@if (! empty($contact['budget']))
**Budget estimé :** {{ $contact['budget'] }}
@endif

**Message :**

{{ $contact['message'] }}

</x-mail::message>
