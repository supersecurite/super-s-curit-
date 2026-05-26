<?php

if (! extension_loaded('intl')) {
    fwrite(STDERR, "ext-intl required\n");
    exit(1);
}

$codes = explode(',', 'AF,AX,AL,DZ,AS,AD,AO,AI,AQ,AG,AR,AM,AW,AU,AT,AZ,BS,BH,BD,BB,BY,BE,BZ,BJ,BM,BT,BO,BQ,BA,BW,BV,BR,IO,BN,BG,BF,BI,CV,KH,CM,CA,KY,CF,TD,CL,CN,CX,CC,CO,KM,CG,CD,CK,CR,CI,HR,CU,CW,CY,CZ,DK,DJ,DM,DO,EC,EG,SV,GQ,ER,EE,SZ,ET,FK,FO,FJ,FI,FR,GF,PF,TF,GA,GM,GE,DE,GH,GI,GR,GL,GD,GP,GU,GT,GG,GN,GW,GY,HT,HM,VA,HN,HK,HU,IS,IN,ID,IR,IQ,IE,IM,IL,IT,JM,JP,JE,JO,KZ,KE,KI,KP,KR,KW,KG,LA,LV,LB,LS,LR,LY,LI,LT,LU,MO,MG,MW,MY,MV,ML,MT,MH,MQ,MR,MU,YT,MX,FM,MD,MC,MN,ME,MS,MA,MZ,MM,NA,NR,NP,NL,NC,NZ,NI,NE,NG,NU,NF,MK,MP,NO,OM,PK,PW,PS,PA,PG,PY,PE,PH,PN,PL,PT,PR,QA,RE,RO,RU,RW,BL,SH,KN,LC,MF,PM,VC,WS,SM,ST,SA,SN,RS,SC,SL,SG,SX,SK,SI,SB,SO,ZA,GS,SS,ES,LK,SD,SR,SJ,SE,CH,SY,TW,TJ,TZ,TH,TL,TG,TK,TO,TT,TN,TR,TM,TC,TV,UG,UA,AE,GB,US,UM,UY,UZ,VU,VE,VN,VG,VI,WF,EH,YE,ZM,ZW,XK');

$overrides = [
    'CI' => "Côte d'Ivoire",
    'CZ' => 'Tchéquie',
    'TR' => 'Turquie',
    'GB' => 'Royaume-Uni',
    'US' => 'États-Unis',
    'XK' => 'Kosovo',
    'SZ' => 'Eswatini',
    'MK' => 'Macédoine du Nord',
    'CV' => 'Cap-Vert',
    'TL' => 'Timor oriental',
    'BO' => 'Bolivie',
    'BN' => 'Brunei',
    'LA' => 'Laos',
    'FM' => 'Micronésie',
    'MD' => 'Moldavie',
    'PS' => 'Palestine',
    'VA' => 'Vatican',
    'AX' => 'Åland',
    'BQ' => 'Pays-Bas caribéens',
    'CW' => 'Curaçao',
    'SX' => 'Saint-Martin',
    'BL' => 'Saint-Barthélemy',
    'MF' => 'Saint-Martin',
    'CD' => 'République démocratique du Congo',
    'CG' => 'République du Congo',
    'KR' => 'Corée du Sud',
    'KP' => 'Corée du Nord',
    'TW' => 'Taïwan',
    'HK' => 'Hong Kong',
    'MO' => 'Macao',
    'EH' => 'Sahara occidental',
    'UM' => 'Îles mineures éloignées des États-Unis',
    'IO' => "Territoire britannique de l'océan Indien",
    'BV' => 'Île Bouvet',
    'HM' => 'Îles Heard-et-MacDonald',
    'GS' => 'Géorgie du Sud-et-les îles Sandwich du Sud',
    'TF' => 'Terres australes françaises',
    'GF' => 'Guyane',
    'PF' => 'Polynésie française',
    'GP' => 'Guadeloupe',
    'MQ' => 'Martinique',
    'RE' => 'La Réunion',
    'YT' => 'Mayotte',
    'NC' => 'Nouvelle-Calédonie',
    'PM' => 'Saint-Pierre-et-Miquelon',
    'WF' => 'Wallis-et-Futuna',
    'FK' => 'Îles Malouines',
    'VI' => 'Îles Vierges des États-Unis',
    'VG' => 'Îles Vierges britanniques',
    'SH' => 'Sainte-Hélène, Ascension et Tristan da Cunha',
];

$out = [];
foreach ($codes as $code) {
    $out[$code] = $overrides[$code] ?? locale_get_display_region('-'.$code, 'fr');
}

echo "<?php\n\n/**\n * @var array<string, string>\n */\nreturn [\n";
foreach ($out as $code => $name) {
    $escaped = str_replace("'", "\\'", $name);
    echo "    '{$code}' => '{$escaped}',\n";
}
echo "];\n";
