// TODO: replace name with proper english names
const timezoneInfos = [
  {
    name: "Midway Island, American Samoa",
    timezone: "Etc/GMT+11",
    offset: "UTC-11:00",
  },
  { name: "Hawaii", timezone: "Pacific/Honolulu", offset: "UTC-10:00" },
  { name: "Alaska", timezone: "America/Anchorage", offset: "UTC-09:00" },
  {
    name: "Baja California",
    timezone: "America/Santa_Isabel",
    offset: "UTC-08:00",
  },
  {
    name: "Pacific Time (US and Canada)",
    timezone: "America/Los_Angeles",
    offset: "UTC-08:00",
  },
  {
    name: "Chihuahua, LaPaz, Mazatlan",
    timezone: "America/Chihuahua",
    offset: "UTC-07:00",
  },
  { name: "Arizona", timezone: "America/Phoenix", offset: "UTC-07:00" },
  {
    name: "Mountain Time (US and Canada)",
    timezone: "America/Denver",
    offset: "UTC-07:00",
  },
  {
    name: "Central America",
    timezone: "America/Guatemala",
    offset: "UTC-06:00",
  },
  {
    name: "Central Time (US and Canada)",
    timezone: "America/Chicago",
    offset: "UTC-06:00",
  },
  {
    name: "Saskatchewan",
    timezone: "America/Regina",
    offset: "UTC-06:00",
  },
  {
    name: "Guadalajara,MexicoCity,Monterrey",
    timezone: "America/Mexico_City",
    offset: "UTC-06:00",
  },
  {
    name: "Bogota,Lima,Quito",
    timezone: "America/Bogota",
    offset: "UTC-05:00",
  },
  {
    name: "Indiana (East)",
    timezone: "America/Indiana/Indianapolis",
    offset: "UTC-05:00",
  },
  {
    name: "Eastern Time (US and Canada)",
    timezone: "America/New_York",
    offset: "UTC-05:00",
  },
  { name: "Caracas", timezone: "America/Caracas", offset: "UTC-04:30" },
  {
    name: "大西洋標準時(カナダ)",
    timezone: "America/Halifax",
    offset: "UTC-04:00",
  },
  {
    name: "Asuncion",
    timezone: "America/Asuncion",
    offset: "UTC-04:00",
  },
  {
    name: "ジョージタウン、ラパス、マナウス、サンフアン",
    timezone: "America/La_Paz",
    offset: "UTC-04:00",
  },
  { name: "Cuiaba", timezone: "America/Cuiaba", offset: "UTC-04:00" },
  {
    name: "Santiago",
    timezone: "America/Santiago",
    offset: "UTC-04:00",
  },
  {
    name: "ニューファンドランド",
    timezone: "America/St_Johns",
    offset: "UTC-03:30",
  },
  {
    name: "ブラジリア",
    timezone: "America/Sao_Paulo",
    offset: "UTC-03:00",
  },
  {
    name: "Greenland",
    timezone: "America/Godthab",
    offset: "UTC-03:00",
  },
  {
    name: "Cayenne, フォルタレザ",
    timezone: "America/Cayenne",
    offset: "UTC-03:00",
  },
  {
    name: "Buenos Aires",
    timezone: "America/Argentina/Buenos_Aires",
    offset: "UTC-03:00",
  },
  {
    name: "Montevideo",
    timezone: "America/Montevideo",
    offset: "UTC-03:00",
  },
  { name: "協定世界時-2", timezone: "Etc/GMT+2", offset: "UTC-02:00" },
  {
    name: "カーボベルデ諸島",
    timezone: "Atlantic/Cape_Verde",
    offset: "UTC-01:00",
  },
  { name: "Azores", timezone: "Atlantic/Azores", offset: "UTC-01:00" },
  {
    name: "Casablanca",
    timezone: "Africa/Casablanca",
    offset: "UTC+00:00",
  },
  {
    name: "モンロビア、Reykjavik",
    timezone: "Atlantic/Reykjavik",
    offset: "UTC+00:00",
  },
  {
    name: "ダブリン、エジンバラ、リスボン, London",
    timezone: "Europe/London",
    offset: "UTC+00:00",
  },
  { name: "協定世界時", timezone: "Etc/GMT", offset: "UTC+00:00" },
  {
    name: "アムステルダム、ベルリン、ベルン、ローマ、ストックホルム、ウィーン",
    timezone: "Europe/Berlin",
    offset: "UTC+01:00",
  },
  {
    name: "ブリュッセル、コペンハーゲン、マドリード、Paris",
    timezone: "Europe/Paris",
    offset: "UTC+01:00",
  },
  {
    name: "西中央アフリカ",
    timezone: "Africa/Lagos",
    offset: "UTC+01:00",
  },
  {
    name: "ベオグラード、ブラチスラバ、ブダペスト、リュブリャナ、プラハ",
    timezone: "Europe/Budapest",
    offset: "UTC+01:00",
  },
  {
    name: "サラエボ、スコピエ、ワルシャワ、ザグレブ",
    timezone: "Europe/Warsaw",
    offset: "UTC+01:00",
  },
  {
    name: "ウィントフック",
    timezone: "Africa/Windhoek",
    offset: "UTC+01:00",
  },
  {
    name: "アテネ、ブカレスト、イスタンブール",
    timezone: "Europe/Istanbul",
    offset: "UTC+02:00",
  },
  {
    name: "ヘルシンキ、キエフ、リガ、ソフィア、タリン、ビリニュス",
    timezone: "Europe/Kiev",
    offset: "UTC+02:00",
  },
  { name: "カイロ", timezone: "Africa/Cairo", offset: "UTC+02:00" },
  { name: "ダマスカス", timezone: "Asia/Damascus", offset: "UTC+02:00" },
  { name: "アンマン", timezone: "Asia/Amman", offset: "UTC+02:00" },
  {
    name: "ハラーレ、プレトリア",
    timezone: "Africa/Johannesburg",
    offset: "UTC+02:00",
  },
  { name: "エルサレム", timezone: "Asia/Jerusalem", offset: "UTC+02:00" },
  { name: "ベイルート", timezone: "Asia/Beirut", offset: "UTC+02:00" },
  { name: "バグダッド", timezone: "Asia/Baghdad", offset: "UTC+03:00" },
  { name: "ミンスク", timezone: "Europe/Minsk", offset: "UTC+03:00" },
  {
    name: "クエート、リヤド",
    timezone: "Asia/Riyadh",
    offset: "UTC+03:00",
  },
  { name: "ナイロビ", timezone: "Africa/Nairobi", offset: "UTC+03:00" },
  { name: "テヘラン", timezone: "Asia/Tehran", offset: "UTC+03:30" },
  {
    name: "モスクワ、サンクトペテルブルグ、ボルゴグラード",
    timezone: "Europe/Moscow",
    offset: "UTC+04:00",
  },
  { name: "トビリシ", timezone: "Asia/Tbilisi", offset: "UTC+04:00" },
  { name: "エレバン", timezone: "Asia/Yerevan", offset: "UTC+04:00" },
  {
    name: "アブダビ、マスカット",
    timezone: "Asia/Dubai",
    offset: "UTC+04:00",
  },
  { name: "バクー", timezone: "Asia/Baku", offset: "UTC+04:00" },
  {
    name: "ポートルイス",
    timezone: "Indian/Mauritius",
    offset: "UTC+04:00",
  },
  { name: "カブール", timezone: "Asia/Kabul", offset: "UTC+04:30" },
  { name: "タシケント", timezone: "Asia/Tashkent", offset: "UTC+05:00" },
  {
    name: "イスラマバード、カラチ",
    timezone: "Asia/Karachi",
    offset: "UTC+05:00",
  },
  {
    name: "スリジャヤワルダナプラコッテ",
    timezone: "Asia/Colombo",
    offset: "UTC+05:30",
  },
  {
    name: "チェンナイ、コルカタ、ムンバイ、ニューデリー",
    timezone: "Asia/Kolkata",
    offset: "UTC+05:30",
  },
  { name: "カトマンズ", timezone: "Asia/Kathmandu", offset: "UTC+05:45" },
  { name: "アスタナ", timezone: "Asia/Almaty", offset: "UTC+06:00" },
  { name: "ダッカ", timezone: "Asia/Dhaka", offset: "UTC+06:00" },
  {
    name: "エカテリンブルグ",
    timezone: "Asia/Yekaterinburg",
    offset: "UTC+06:00",
  },
  { name: "ヤンゴン", timezone: "Asia/Yangon", offset: "UTC+06:30" },
  {
    name: "バンコク、ハノイ、ジャカルタ",
    timezone: "Asia/Bangkok",
    offset: "UTC+07:00",
  },
  {
    name: "ノヴォシビルスク",
    timezone: "Asia/Novosibirsk",
    offset: "UTC+07:00",
  },
  {
    name: "クラスノヤルスク",
    timezone: "Asia/Krasnoyarsk",
    offset: "UTC+08:00",
  },
  {
    name: "ウランバートル",
    timezone: "Asia/Ulaanbaatar",
    offset: "UTC+08:00",
  },
  {
    name: "北京、重慶、香港、ウルムチ",
    timezone: "Asia/Shanghai",
    offset: "UTC+08:00",
  },
  { name: "パース", timezone: "Australia/Perth", offset: "UTC+08:00" },
  {
    name: "クアラルンプール、シンガポール",
    timezone: "Asia/Singapore",
    offset: "UTC+08:00",
  },
  { name: "台北", timezone: "Asia/Taipei", offset: "UTC+08:00" },
  { name: "イルクーツク", timezone: "Asia/Irkutsk", offset: "UTC+09:00" },
  { name: "ソウル", timezone: "Asia/Seoul", offset: "UTC+09:00" },
  {
    name: "大阪、札幌、東京",
    timezone: "Asia/Tokyo",
    offset: "UTC+09:00",
  },
  {
    name: "ダーウィン",
    timezone: "Australia/Darwin",
    offset: "UTC+09:30",
  },
  {
    name: "アデレード",
    timezone: "Australia/Adelaide",
    offset: "UTC+09:30",
  },
  { name: "ホバート", timezone: "Australia/Hobart", offset: "UTC+10:00" },
  { name: "ヤクーツク", timezone: "Asia/Yakutsk", offset: "UTC+10:00" },
  {
    name: "ブリスベン",
    timezone: "Australia/Brisbane",
    offset: "UTC+10:00",
  },
  {
    name: "グアム、ポートモレスビー",
    timezone: "Pacific/Port_Moresby",
    offset: "UTC+10:00",
  },
  {
    name: "キャンベラ、メルボルン、シドニー",
    timezone: "Australia/Sydney",
    offset: "UTC+10:00",
  },
  {
    name: "ウラジオストク",
    timezone: "Asia/Vladivostok",
    offset: "UTC+11:00",
  },
  {
    name: "ソロモン諸島、ニューカレドニア",
    timezone: "Pacific/Guadalcanal",
    offset: "UTC+11:00",
  },
  { name: "協定世界時+12", timezone: "Etc/GMT-12", offset: "UTC+12:00" },
  {
    name: "フィジー、マーシャル諸島",
    timezone: "Pacific/Fiji",
    offset: "UTC+12:00",
  },
  { name: "マガダン", timezone: "Asia/Magadan", offset: "UTC+12:00" },
  {
    name: "オークランド、ウェリントン",
    timezone: "Pacific/Auckland",
    offset: "UTC+12:00",
  },
  {
    name: "ヌクアロファ",
    timezone: "Pacific/Tongatapu",
    offset: "UTC+13:00",
  },
  { name: "Samoa", timezone: "Pacific/Apia", offset: "UTC+13:00" },
] as const;

type TimezoneName = typeof timezoneInfos[number]["timezone"];

export class Timezone {
  public timezoneName: TimezoneName;

  constructor(maybeTimezoneName: string) {
    Timezone.assertStringIsTimezone(maybeTimezoneName);
    this.timezoneName = maybeTimezoneName;
  }
  get id() {
    return this.timezoneName;
  }

  get offset() {
    const timezoneInfo = Timezone.findTimezoneInfo(this.timezoneName);
    return timezoneInfo.offset;
  }

  static getTimezoneList() {
    return timezoneInfos;
  }

  private static assertStringIsTimezone(
    maybeTimezone: string
  ): asserts maybeTimezone is TimezoneName {
    if (
      !timezoneInfos
        .map((info) => info.timezone)
        .includes(maybeTimezone as TimezoneName)
    ) {
      throw new Error(`${maybeTimezone} is not a valid timezone`);
    }
  }

  private static findTimezoneInfo(
    timezoneName: TimezoneName
  ): typeof timezoneInfos[number] {
    const index = timezoneInfos.findIndex((tz) => timezoneName === tz.timezone);
    if (index < 0) {
      throw new Error(`${timezoneName} not found`);
    }
    return timezoneInfos[index];
  }
}
