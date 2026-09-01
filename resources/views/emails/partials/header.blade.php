<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{{ $branding['header_bg'] }};">
    <tr>
        <td style="padding:20px 24px;vertical-align:middle;">
            <a href="{{ $branding['website_url'] }}" style="text-decoration:none;display:inline-block;">
                <img
                    src="{{ $branding['logo_url'] }}"
                    alt="{{ $branding['app_name'] }}"
                    height="48"
                    style="display:block;height:48px;width:auto;max-width:220px;border:0;"
                >
            </a>
        </td>
        <td style="padding:20px 24px;vertical-align:middle;text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.65;color:#d4d4d8;">
            @if ($branding['phone_display'] !== '')
                <div>Tél&nbsp;: {{ $branding['phone_display'] }}</div>
            @endif
            @if ($branding['email'] !== '')
                <div>E-mail&nbsp;: <a href="mailto:{{ $branding['email'] }}" style="color:#e4e4e7;text-decoration:none;">{{ $branding['email'] }}</a></div>
            @endif
            @if ($branding['address_short'] !== '')
                <div>Adresse&nbsp;: {{ $branding['address_short'] }}</div>
            @endif
        </td>
    </tr>
</table>
