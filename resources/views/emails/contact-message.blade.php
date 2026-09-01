@extends('emails.layout')

@section('content')
    <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:#18181b;">Nouveau message de contact</h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:15px;line-height:1.6;">
        <tr>
            <td style="padding:8px 0;color:#71717a;width:140px;vertical-align:top;">Nom</td>
            <td style="padding:8px 0;font-weight:600;">{{ $contact['name'] }}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;color:#71717a;vertical-align:top;">E-mail</td>
            <td style="padding:8px 0;"><a href="mailto:{{ $contact['email'] }}" style="color:{{ $branding['accent_color'] }};text-decoration:none;">{{ $contact['email'] }}</a></td>
        </tr>
        @if (! empty($contact['phone']))
            <tr>
                <td style="padding:8px 0;color:#71717a;vertical-align:top;">Téléphone</td>
                <td style="padding:8px 0;">{{ $contact['phone'] }}</td>
            </tr>
        @endif
        @if (! empty($contact['company']))
            <tr>
                <td style="padding:8px 0;color:#71717a;vertical-align:top;">Entreprise</td>
                <td style="padding:8px 0;">{{ $contact['company'] }}</td>
            </tr>
        @endif
        @if (! empty($contact['project_type']))
            <tr>
                <td style="padding:8px 0;color:#71717a;vertical-align:top;">Type de projet</td>
                <td style="padding:8px 0;">{{ $contact['project_type'] }}</td>
            </tr>
        @endif
    </table>

    <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e4e4e7;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#52525b;">Message</p>
        <p style="margin:0;white-space:pre-wrap;">{{ $contact['message'] }}</p>
    </div>
@endsection
