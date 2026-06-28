export type Country = { code: string; name: string; english: string; flag: string };

const flag = (code: string) =>
  code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const raw: Array<[string, string, string]> = [
  ["IQ", "عێراق", "Iraq"], ["TR", "تورکیا", "Turkey"], ["IR", "ئێران", "Iran"], ["SY", "سوریا", "Syria"],
  ["JO", "ئوردن", "Jordan"], ["LB", "لوبنان", "Lebanon"], ["SA", "عەرەبستانی سعودیە", "Saudi Arabia"], ["AE", "ئیمارات", "United Arab Emirates"],
  ["QA", "قەتەر", "Qatar"], ["KW", "کوێت", "Kuwait"], ["BH", "بەحرەین", "Bahrain"], ["OM", "عومان", "Oman"],
  ["YE", "یەمەن", "Yemen"], ["PS", "فەلەستین", "Palestine"], ["IL", "ئیسرائیل", "Israel"], ["EG", "میسر", "Egypt"],
  ["LY", "لیبیا", "Libya"], ["TN", "تونس", "Tunisia"], ["DZ", "جەزائیر", "Algeria"], ["MA", "مەغریب", "Morocco"],
  ["SD", "سودان", "Sudan"], ["SS", "سودانی باشوور", "South Sudan"], ["SO", "سۆماڵ", "Somalia"], ["DJ", "جیبوتی", "Djibouti"],
  ["ET", "ئەسیوپیا", "Ethiopia"], ["ER", "ئەریتریا", "Eritrea"], ["KE", "کینیا", "Kenya"], ["UG", "ئوگاندا", "Uganda"],
  ["TZ", "تانزانیا", "Tanzania"], ["RW", "ڕواندا", "Rwanda"], ["BI", "بوروندی", "Burundi"], ["CD", "کۆنگۆی دیموکراتی", "DR Congo"],
  ["CG", "کۆنگۆ", "Congo"], ["CM", "کامیرۆن", "Cameroon"], ["NG", "نیجیریا", "Nigeria"], ["GH", "غانا", "Ghana"],
  ["CI", "کۆتدیڤوار", "Ivory Coast"], ["SN", "سینیگال", "Senegal"], ["ML", "مالی", "Mali"], ["NE", "نیجەر", "Niger"],
  ["TD", "چاد", "Chad"], ["BF", "بورکینا فاسۆ", "Burkina Faso"], ["BJ", "بینین", "Benin"], ["TG", "تۆگۆ", "Togo"],
  ["GM", "گامبیا", "Gambia"], ["GN", "گینیا", "Guinea"], ["GW", "گینیای بیساو", "Guinea-Bissau"], ["SL", "سیەرالیۆن", "Sierra Leone"],
  ["LR", "لیبیریا", "Liberia"], ["GA", "گابۆن", "Gabon"], ["GQ", "گینیای ئیستوایی", "Equatorial Guinea"], ["CF", "کۆماری ئەفریقای ناوەڕاست", "Central African Republic"],
  ["AO", "ئەنگۆلا", "Angola"], ["ZM", "زامبیا", "Zambia"], ["ZW", "زیمبابوێ", "Zimbabwe"], ["MW", "مالاوی", "Malawi"],
  ["MZ", "مۆزامبیق", "Mozambique"], ["NA", "نامیبیا", "Namibia"], ["BW", "بۆتسوانا", "Botswana"], ["ZA", "ئەفریقای باشوور", "South Africa"],
  ["LS", "لیسۆتۆ", "Lesotho"], ["SZ", "ئیسواتینی", "Eswatini"], ["MG", "ماداگاسکار", "Madagascar"], ["MU", "مۆریشس", "Mauritius"],
  ["SC", "سیشەل", "Seychelles"], ["KM", "کۆمۆرۆس", "Comoros"], ["CV", "کەیپ ڤێردی", "Cape Verde"], ["MR", "مۆریتانیا", "Mauritania"],
  ["AF", "ئەفغانستان", "Afghanistan"], ["PK", "پاکستان", "Pakistan"], ["IN", "هیندستان", "India"], ["BD", "بەنگلادیش", "Bangladesh"],
  ["NP", "نیپال", "Nepal"], ["BT", "بوتان", "Bhutan"], ["LK", "سریلانکا", "Sri Lanka"], ["MV", "مالدیڤ", "Maldives"],
  ["CN", "چین", "China"], ["JP", "ژاپۆن", "Japan"], ["KR", "کۆریای باشوور", "South Korea"], ["KP", "کۆریای باکوور", "North Korea"],
  ["MN", "مەنگۆلیا", "Mongolia"], ["TW", "تایوان", "Taiwan"], ["HK", "هۆنگ کۆنگ", "Hong Kong"], ["MO", "ماکاو", "Macao"],
  ["TH", "تایلەند", "Thailand"], ["MY", "مالیزیا", "Malaysia"], ["SG", "سینگاپور", "Singapore"], ["ID", "ئیندۆنیزیا", "Indonesia"],
  ["PH", "فلیپین", "Philippines"], ["VN", "ڤێتنام", "Vietnam"], ["KH", "کەمبۆدیا", "Cambodia"], ["LA", "لاوس", "Laos"],
  ["MM", "میانمار", "Myanmar"], ["BN", "برونای", "Brunei"], ["TL", "تیمۆری ڕۆژهەڵات", "Timor-Leste"],
  ["KZ", "کازاخستان", "Kazakhstan"], ["UZ", "ئۆزبەکستان", "Uzbekistan"], ["TM", "تورکمانستان", "Turkmenistan"], ["KG", "قیرغیزستان", "Kyrgyzstan"],
  ["TJ", "تاجیکستان", "Tajikistan"], ["AZ", "ئازەربایجان", "Azerbaijan"], ["AM", "ئەرمەنستان", "Armenia"], ["GE", "جۆرجیا", "Georgia"],
  ["CY", "قیبرس", "Cyprus"], ["GR", "یۆنان", "Greece"], ["BG", "بولگاریا", "Bulgaria"], ["RO", "ڕۆمانیا", "Romania"],
  ["AL", "ئەلبانیا", "Albania"], ["MK", "مەقدۆنیای باکوور", "North Macedonia"], ["RS", "سربیا", "Serbia"], ["ME", "مۆنتینیگرۆ", "Montenegro"],
  ["BA", "بۆسنە و هەرزەگۆڤینا", "Bosnia and Herzegovina"], ["HR", "کرواتیا", "Croatia"], ["SI", "سلۆڤینیا", "Slovenia"], ["XK", "کۆسۆڤۆ", "Kosovo"],
  ["AT", "نەمسا", "Austria"], ["DE", "ئەڵمانیا", "Germany"], ["CH", "سویسرا", "Switzerland"], ["LI", "لیختنشتاین", "Liechtenstein"],
  ["IT", "ئیتالیا", "Italy"], ["FR", "فەڕەنسا", "France"], ["ES", "ئیسپانیا", "Spain"], ["PT", "پورتوگال", "Portugal"],
  ["BE", "بەلجیکا", "Belgium"], ["NL", "هۆڵەندا", "Netherlands"], ["LU", "لوکسەمبۆرگ", "Luxembourg"], ["GB", "بەریتانیا", "United Kingdom"],
  ["IE", "ئیرلەندا", "Ireland"], ["IS", "ئایسلەندا", "Iceland"], ["NO", "نەرویج", "Norway"], ["SE", "سوید", "Sweden"],
  ["FI", "فینلەندا", "Finland"], ["DK", "دانیمارک", "Denmark"], ["PL", "پۆڵەندا", "Poland"], ["CZ", "چیک", "Czechia"],
  ["SK", "سلۆڤاکیا", "Slovakia"], ["HU", "هەنگاریا", "Hungary"], ["UA", "ئۆکرانیا", "Ukraine"], ["MD", "مۆڵدۆڤا", "Moldova"],
  ["BY", "بێلاڕوس", "Belarus"], ["LT", "لیتوانیا", "Lithuania"], ["LV", "لاتڤیا", "Latvia"], ["EE", "ئیستۆنیا", "Estonia"],
  ["RU", "ڕووسیا", "Russia"], ["MT", "ماڵتا", "Malta"], ["MC", "مۆناکۆ", "Monaco"], ["SM", "سان مارینۆ", "San Marino"],
  ["VA", "ڤاتیکان", "Vatican City"], ["AD", "ئەندۆرا", "Andorra"],
  ["US", "ویلایەتە یەکگرتووەکان", "United States"], ["CA", "کەنەدا", "Canada"], ["MX", "مەکسیک", "Mexico"],
  ["GT", "گواتیمالا", "Guatemala"], ["BZ", "بەلیز", "Belize"], ["HN", "هۆندوراس", "Honduras"], ["SV", "ئێلسالڤادۆر", "El Salvador"],
  ["NI", "نیکاراگوا", "Nicaragua"], ["CR", "کۆستاریکا", "Costa Rica"], ["PA", "پاناما", "Panama"], ["CU", "کوبا", "Cuba"],
  ["JM", "جامایکا", "Jamaica"], ["HT", "هایتی", "Haiti"], ["DO", "کۆماری دۆمینیکان", "Dominican Republic"], ["BS", "بەهاماس", "Bahamas"],
  ["BB", "باربادۆس", "Barbados"], ["TT", "ترینیداد و تۆباگۆ", "Trinidad and Tobago"], ["AG", "ئەنتیگوا و باربودا", "Antigua and Barbuda"],
  ["DM", "دۆمینیکا", "Dominica"], ["GD", "گرینادا", "Grenada"], ["KN", "سەینت کیتس و نیڤیس", "Saint Kitts and Nevis"],
  ["LC", "سەینت لوسیا", "Saint Lucia"], ["VC", "سەینت ڤینسەنت", "Saint Vincent and the Grenadines"],
  ["BR", "بەڕازیل", "Brazil"], ["AR", "ئەرجەنتین", "Argentina"], ["CL", "چیلی", "Chile"], ["PE", "پێرو", "Peru"],
  ["BO", "بۆلیڤیا", "Bolivia"], ["PY", "پاراگوای", "Paraguay"], ["UY", "ئوروگوای", "Uruguay"], ["CO", "کۆلۆمبیا", "Colombia"],
  ["VE", "ڤەنزوێلا", "Venezuela"], ["EC", "ئیکوادۆر", "Ecuador"], ["GY", "گویانا", "Guyana"], ["SR", "سورینام", "Suriname"],
  ["AU", "ئوسترالیا", "Australia"], ["NZ", "نیوزیلەندا", "New Zealand"], ["PG", "پاپوا گینیای نوێ", "Papua New Guinea"], ["FJ", "فیجی", "Fiji"],
  ["SB", "دورگەکانی سلێمان", "Solomon Islands"], ["VU", "ڤانواتو", "Vanuatu"], ["WS", "سامۆا", "Samoa"], ["TO", "تۆنگا", "Tonga"],
  ["KI", "کیریباتی", "Kiribati"], ["TV", "توڤالو", "Tuvalu"], ["NR", "نائورو", "Nauru"], ["PW", "پالاو", "Palau"],
  ["FM", "مایکرۆنیزیا", "Micronesia"], ["MH", "دورگەکانی مارشاڵ", "Marshall Islands"],
];

export const countries: Country[] = raw
  .map(([code, name, english]) => ({ code, name, english, flag: flag(code) }))
  .sort((a, b) => a.name.localeCompare(b.name, "ckb"));

export const getCountry = (code: string) => countries.find((country) => country.code === code);

export const countryLabel = (code: string) => {
  const country = getCountry(code);
  return country ? `${country.name} (${country.english})` : code;
};
