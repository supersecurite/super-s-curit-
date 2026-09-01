@props([
    'url',
    'label',
])

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto;">
    <tr>
        <td align="center" style="border-radius:8px;background-color:{{ $branding['accent_color'] }};">
            <a
                href="{{ $url }}"
                target="_blank"
                rel="noopener noreferrer"
                style="display:inline-block;padding:12px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;"
            >
                {{ $label }}
            </a>
        </td>
    </tr>
</table>
