@extends('emails.layout')

@section('content')
    <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:#18181b;">Nouvelle candidature agent</h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:15px;line-height:1.6;">
        <tr>
            <td style="padding:8px 0;color:#71717a;width:180px;vertical-align:top;">Nom</td>
            <td style="padding:8px 0;font-weight:600;">{{ $application['full_name'] }}</td>
        </tr>
        <tr>
            <td style="padding:8px 0;color:#71717a;vertical-align:top;">Téléphone</td>
            <td style="padding:8px 0;">{{ $application['phone'] }}</td>
        </tr>
        @if (! empty($application['email']))
            <tr>
                <td style="padding:8px 0;color:#71717a;vertical-align:top;">E-mail</td>
                <td style="padding:8px 0;"><a href="mailto:{{ $application['email'] }}" style="color:{{ $branding['accent_color'] }};text-decoration:none;">{{ $application['email'] }}</a></td>
            </tr>
        @endif
        @if (! empty($application['post_label']))
            <tr>
                <td style="padding:8px 0;color:#71717a;vertical-align:top;">Poste</td>
                <td style="padding:8px 0;">{{ $application['post_label'] }}</td>
            </tr>
        @endif
        @if (! empty($application['experience_years']))
            <tr>
                <td style="padding:8px 0;color:#71717a;vertical-align:top;">Expérience</td>
                <td style="padding:8px 0;">{{ $application['experience_years'] }} an(s)</td>
            </tr>
        @endif
        @if (! empty($application['availability_label']))
            <tr>
                <td style="padding:8px 0;color:#71717a;vertical-align:top;">Disponibilité</td>
                <td style="padding:8px 0;">{{ $application['availability_label'] }}</td>
            </tr>
        @endif
        <tr>
            <td style="padding:8px 0;color:#71717a;vertical-align:top;">Localisation</td>
            <td style="padding:8px 0;">{{ $application['location_summary'] }}</td>
        </tr>
        @if (! empty($application['address_detail']))
            <tr>
                <td style="padding:8px 0;color:#71717a;vertical-align:top;">Adresse complémentaire</td>
                <td style="padding:8px 0;">{{ $application['address_detail'] }}</td>
            </tr>
        @endif
    </table>

    @if (! empty($application['certifications']))
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e4e4e7;">
            <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#52525b;">Certifications</p>
            <p style="margin:0;white-space:pre-wrap;">{{ $application['certifications'] }}</p>
        </div>
    @endif

    @if (! empty($application['motivation']))
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e4e4e7;">
            <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#52525b;">Motivation</p>
            <p style="margin:0;white-space:pre-wrap;">{{ $application['motivation'] }}</p>
        </div>
    @endif
@endsection
