@props([
    'url',
    'label',
])

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:32px auto;">
    <tr>
        <td align="center" style="border-radius:10px;background-color:{{ $branding['accent_color'] }};box-shadow:0 4px 14px rgba(237,28,36,0.28);">
            <a
                href="{{ $url }}"
                target="_blank"
                rel="noopener noreferrer"
                style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.01em;color:#ffffff;text-decoration:none;border-radius:10px;"
            >
                {{ $label }}
            </a>
        </td>
    </tr>
</table>
