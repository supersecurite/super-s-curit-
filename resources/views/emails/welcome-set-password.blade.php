@extends('emails.layout')

@section('content')
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#18181b;">Bonjour{{ ! empty($name) ? ' '.$name : '' }} !</h1>

    <p style="margin:0 0 16px;">Un compte a été créé pour vous sur <strong>{{ $appName ?? $branding['app_name'] }}</strong>. Choisissez votre mot de passe pour vous connecter.</p>

    @include('emails.partials.button', [
        'url' => $url,
        'label' => 'Choisir mon mot de passe',
    ])

    <p style="margin:0 0 16px;">Ce lien expire dans <strong>{{ $minutes }} minutes</strong>.</p>

    <p style="margin:0 0 8px;font-size:14px;color:#71717a;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur&nbsp;:</p>
    <p style="margin:0 0 24px;font-size:13px;line-height:1.5;word-break:break-all;color:#52525b;">{{ $url }}</p>

    <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;">

    <p style="margin:0;font-size:14px;color:#71717a;">
        Si vous n&apos;êtes pas à l&apos;origine de cette invitation, ignorez cet e-mail.
    </p>
@endsection
