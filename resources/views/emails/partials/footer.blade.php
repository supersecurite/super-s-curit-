<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{{ $branding['footer_bg'] }};">
    <tr>
        <td style="height:1px;background-color:{{ $branding['accent_color'] }};font-size:0;line-height:0;opacity:0.35;">&nbsp;</td>
    </tr>
    <tr>
        <td style="padding:28px 32px 32px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0 0 10px;font-size:14px;font-weight:700;letter-spacing:0.02em;color:#ffffff;">
                {{ $branding['app_name'] }}
            </p>
            @if ($branding['website'] !== '')
                <p style="margin:0 0 16px;font-size:12px;line-height:1.5;">
                    <a href="{{ $branding['website_url'] }}" style="color:{{ $branding['footer_text'] }};text-decoration:none;font-weight:600;">{{ $branding['website'] }}</a>
                </p>
            @endif
            <p style="margin:0;font-size:11px;line-height:1.75;color:{{ $branding['footer_text'] }};opacity:0.9;">
                {{ $branding['legal_footer'] }}
            </p>
        </td>
    </tr>
</table>
