<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{{ $branding['footer_bg'] }};border-top:3px solid {{ $branding['accent_color'] }};">
    <tr>
        <td style="padding:36px 32px 32px;text-align:center;font-family:Arial,Helvetica,sans-serif;color:{{ $branding['footer_text'] }};">
            <p style="margin:0 0 16px;font-size:15px;font-weight:700;letter-spacing:0.03em;color:#ffffff;text-transform:uppercase;">
                {{ $branding['app_name'] }}
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 20px;text-align:center;">
                @if ($branding['phone_display'] !== '')
                    <tr>
                        <td style="padding:4px 8px;font-size:13px;line-height:1.6;color:{{ $branding['footer_text'] }};">
                            <strong style="color:{{ $branding['accent_color'] }};">Tél&nbsp;:</strong>&nbsp;{{ $branding['phone_display'] }}
                        </td>
                    </tr>
                @endif
                @if ($branding['email'] !== '')
                    <tr>
                        <td style="padding:4px 8px;font-size:13px;line-height:1.6;color:{{ $branding['footer_text'] }};">
                            <strong style="color:{{ $branding['accent_color'] }};">E-mail&nbsp;:</strong>&nbsp;
                            <a href="mailto:{{ $branding['email'] }}" style="color:#ffffff;text-decoration:underline;">{{ $branding['email'] }}</a>
                        </td>
                    </tr>
                @endif
                @if ($branding['address'] !== '')
                    <tr>
                        <td style="padding:4px 8px;font-size:13px;line-height:1.6;color:{{ $branding['footer_text'] }};">
                            <strong style="color:{{ $branding['accent_color'] }};">Adresse&nbsp;:</strong>&nbsp;{{ $branding['address'] }}
                        </td>
                    </tr>
                @endif
                @if ($branding['website'] !== '')
                    <tr>
                        <td style="padding:4px 8px;font-size:13px;line-height:1.6;color:{{ $branding['footer_text'] }};">
                            <strong style="color:{{ $branding['accent_color'] }};">Site web&nbsp;:</strong>&nbsp;
                            <a href="{{ $branding['website_url'] }}" style="color:#ffffff;text-decoration:none;font-weight:600;">{{ $branding['website'] }}</a>
                        </td>
                    </tr>
                @endif
            </table>

            <p style="margin:0;font-size:11px;line-height:1.75;color:{{ $branding['footer_muted'] }};border-top:1px solid rgba(255,255,255,0.12);padding-top:16px;">
                {{ $branding['legal_footer'] }}
            </p>
        </td>
    </tr>
</table>

