<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{{ $branding['header_bg'] }};">
    <tr>
        <td style="padding:32px 32px 20px;text-align:center;">
            <a href="{{ $branding['website_url'] }}" style="text-decoration:none;display:inline-block;">
                <img
                    src="{{ $branding['logo_url'] }}"
                    alt="{{ $branding['app_name'] }}"
                    height="52"
                    style="display:block;height:52px;width:auto;max-width:240px;border:0;margin:0 auto;"
                >
            </a>
        </td>
    </tr>
    <tr>
        <td style="padding:0 32px 28px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:{{ $branding['header_muted'] }};">
                Protection · Surveillance · Sécurité
            </p>
            @if ($branding['phone_display'] !== '' || $branding['email'] !== '' || $branding['address_short'] !== '')
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                    @if ($branding['phone_display'] !== '')
                        <tr>
                            <td style="padding:4px 8px;font-size:13px;line-height:1.6;color:{{ $branding['header_text'] }};">
                                <span style="color:{{ $branding['header_muted'] }};">Tél</span>&nbsp;&nbsp;{{ $branding['phone_display'] }}
                            </td>
                        </tr>
                    @endif
                    @if ($branding['email'] !== '')
                        <tr>
                            <td style="padding:4px 8px;font-size:13px;line-height:1.6;color:{{ $branding['header_text'] }};">
                                <span style="color:{{ $branding['header_muted'] }};">E-mail</span>&nbsp;&nbsp;
                                <a href="mailto:{{ $branding['email'] }}" style="color:{{ $branding['header_text'] }};text-decoration:none;font-weight:600;">{{ $branding['email'] }}</a>
                            </td>
                        </tr>
                    @endif
                    @if ($branding['address_short'] !== '')
                        <tr>
                            <td style="padding:4px 8px;font-size:13px;line-height:1.6;color:{{ $branding['header_text'] }};">
                                <span style="color:{{ $branding['header_muted'] }};">Adresse</span>&nbsp;&nbsp;{{ $branding['address_short'] }}
                            </td>
                        </tr>
                    @endif
                </table>
            @endif
        </td>
    </tr>
    <tr>
        <td style="height:4px;background-color:{{ $branding['accent_color'] }};font-size:0;line-height:0;">&nbsp;</td>
    </tr>
</table>
