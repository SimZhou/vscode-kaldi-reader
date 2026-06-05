import * as vscode from "vscode";

export interface Messages {
  openArkInputTitle: string;
  openArkInputPrompt: string;
  invalidArkLocation: (location: string) => string;
  readArkEntryFailed: (message: string) => string;
  audioLensOpenFailed: (message: string) => string;
  nonAudioPreviewTitle: string;
  nonAudioDetected: (title: string) => string;
  recognizedArkEntry: (typeName: string, title: string) => string;
  unknownKey: string;
  manualInputSource: string;
  typeFloatMatrix: string;
  typeInt32Vector: string;
  typeUnknown: string;
  shape: (rows: number, cols: number) => string;
  length: (size: number) => string;
  sampleRows: (count: number) => string;
  sampleItems: (count: number) => string;
  reason: (reason: string) => string;
  relativePathResolveFailed: (location: string) => string;
  documentLinkOpen: (location: string) => string;
  documentLinkResolve: (location: string) => string;
  binaryOnly: string;
  unsupportedBinaryToken: (token: string) => string;
  readBinaryTokenFailed: string;
  unsupportedBasicTypeSize: (size: number) => string;
  incompleteArkEntry: (expected: number, actual: number) => string;
}

const EN: Messages = {
  openArkInputTitle: "Open Kaldi Ark Entry",
  openArkInputPrompt: "Enter an ark entry location, for example /path/to/wav.ark:23252",
  invalidArkLocation: (location) => `Invalid ark entry location: ${location}`,
  readArkEntryFailed: (message) => `Failed to read ark entry: ${message}`,
  audioLensOpenFailed: (message) =>
    `Failed to open wav ark with AudioLens. Make sure simzhou.audiolens is installed and enabled: ${message}`,
  nonAudioPreviewTitle: "Kaldi Reader non-audio ark entry preview",
  nonAudioDetected: (title) => `Kaldi Reader recognized non-audio ark entry: ${title}`,
  recognizedArkEntry: (typeName, title) => `Kaldi Reader recognized ${typeName}: ${title}`,
  unknownKey: "(unknown)",
  manualInputSource: "(manual input)",
  typeFloatMatrix: "Type: FloatMatrix",
  typeInt32Vector: "Type: Int32Vector",
  typeUnknown: "Type: Unknown",
  shape: (rows, cols) => `Shape: ${rows} x ${cols}`,
  length: (size) => `Length: ${size}`,
  sampleRows: (count) => `Sample: first ${count} row(s)`,
  sampleItems: (count) => `Sample: first ${count} item(s)`,
  reason: (reason) => `Reason: ${reason}`,
  relativePathResolveFailed: (location) =>
    [
      `Unable to resolve relative ark path: ${location}`,
      "Currently, only these two relative path bases are supported:",
      "1. Relative to the current .scp file directory;",
      "2. Relative to the current workspace root.",
      "Other implicit CWD-based paths are not guessed automatically."
    ].join("\n"),
  documentLinkOpen: (location) => `Open ${location}`,
  documentLinkResolve: (location) => `Resolve ${location} from SCP directory or workspace root`,
  binaryOnly: "The initial version only supports Kaldi binary ark entries",
  unsupportedBinaryToken: (token) => `Unsupported Kaldi binary token: ${token}`,
  readBinaryTokenFailed: "Failed to read Kaldi binary token",
  unsupportedBasicTypeSize: (size) => `Unsupported Kaldi basic type size tag: ${size}`,
  incompleteArkEntry: (expected, actual) =>
    `Incomplete ark entry data: expected ${expected} bytes, read ${actual} bytes`
};

const ZH_CN: Messages = {
  openArkInputTitle: "打开 Kaldi Ark Entry",
  openArkInputPrompt: "输入 ark entry 位置，例如 /path/to/wav.ark:23252",
  invalidArkLocation: (location) => `无效的 ark entry 位置：${location}`,
  readArkEntryFailed: (message) => `无法读取 ark entry：${message}`,
  audioLensOpenFailed: (message) =>
    `无法用 AudioLens 打开 wav ark。请确认已安装并启用 simzhou.audiolens：${message}`,
  nonAudioPreviewTitle: "Kaldi Reader 非音频 ark entry 预览",
  nonAudioDetected: (title) => `Kaldi Reader 已识别非音频 ark entry：${title}`,
  recognizedArkEntry: (typeName, title) => `Kaldi Reader 已识别 ${typeName}：${title}`,
  unknownKey: "(unknown)",
  manualInputSource: "(manual input)",
  typeFloatMatrix: "Type: FloatMatrix",
  typeInt32Vector: "Type: Int32Vector",
  typeUnknown: "Type: Unknown",
  shape: (rows, cols) => `Shape: ${rows} x ${cols}`,
  length: (size) => `Length: ${size}`,
  sampleRows: (count) => `Sample: first ${count} row(s)`,
  sampleItems: (count) => `Sample: first ${count} item(s)`,
  reason: (reason) => `Reason: ${reason}`,
  relativePathResolveFailed: (location) =>
    [
      `无法解析相对 ark 路径：${location}`,
      "当前仅支持两种相对路径基准：",
      "1. 相对于当前 .scp 文件所在目录；",
      "2. 相对于当前 workspace 根目录。",
      "其他隐含 CWD 的写法暂不自动猜测。"
    ].join("\n"),
  documentLinkOpen: (location) => `打开 ${location}`,
  documentLinkResolve: (location) => `按 SCP 文件目录或 workspace 根目录解析 ${location}`,
  binaryOnly: "当前初版只支持 Kaldi binary ark entry",
  unsupportedBinaryToken: (token) => `暂不支持 Kaldi binary token: ${token}`,
  readBinaryTokenFailed: "无法读取 Kaldi binary token",
  unsupportedBasicTypeSize: (size) => `不支持的 Kaldi basic type size tag: ${size}`,
  incompleteArkEntry: (expected, actual) =>
    `ark entry 数据不完整：期望 ${expected} 字节，实际 ${actual} 字节`
};

const ZH_TW: Messages = {
  ...ZH_CN,
  openArkInputTitle: "開啟 Kaldi Ark Entry",
  openArkInputPrompt: "輸入 ark entry 位置，例如 /path/to/wav.ark:23252",
  invalidArkLocation: (location) => `無效的 ark entry 位置：${location}`,
  readArkEntryFailed: (message) => `無法讀取 ark entry：${message}`,
  audioLensOpenFailed: (message) =>
    `無法用 AudioLens 開啟 wav ark。請確認已安裝並啟用 simzhou.audiolens：${message}`,
  nonAudioPreviewTitle: "Kaldi Reader 非音訊 ark entry 預覽",
  nonAudioDetected: (title) => `Kaldi Reader 已識別非音訊 ark entry：${title}`,
  recognizedArkEntry: (typeName, title) => `Kaldi Reader 已識別 ${typeName}：${title}`,
  relativePathResolveFailed: (location) =>
    [
      `無法解析相對 ark 路徑：${location}`,
      "目前僅支援兩種相對路徑基準：",
      "1. 相對於目前 .scp 檔案所在目錄；",
      "2. 相對於目前 workspace 根目錄。",
      "其他隱含 CWD 的寫法暫不自動猜測。"
    ].join("\n"),
  documentLinkOpen: (location) => `開啟 ${location}`,
  documentLinkResolve: (location) => `按 SCP 檔案目錄或 workspace 根目錄解析 ${location}`,
  binaryOnly: "目前初版只支援 Kaldi binary ark entry",
  unsupportedBinaryToken: (token) => `暫不支援 Kaldi binary token: ${token}`,
  readBinaryTokenFailed: "無法讀取 Kaldi binary token",
  unsupportedBasicTypeSize: (size) => `不支援的 Kaldi basic type size tag: ${size}`,
  incompleteArkEntry: (expected, actual) =>
    `ark entry 資料不完整：期望 ${expected} 位元組，實際 ${actual} 位元組`
};

const JA: Messages = {
  ...EN,
  openArkInputTitle: "Kaldi Ark Entry を開く",
  openArkInputPrompt: "ark entry の場所を入力してください。例: /path/to/wav.ark:23252",
  invalidArkLocation: (location) => `無効な ark entry の場所です: ${location}`,
  readArkEntryFailed: (message) => `ark entry を読み取れません: ${message}`,
  audioLensOpenFailed: (message) =>
    `AudioLens で wav ark を開けません。simzhou.audiolens がインストールされ有効化されていることを確認してください: ${message}`,
  nonAudioPreviewTitle: "Kaldi Reader 非音声 ark entry プレビュー",
  nonAudioDetected: (title) => `Kaldi Reader が非音声 ark entry を認識しました: ${title}`,
  recognizedArkEntry: (typeName, title) => `Kaldi Reader が ${typeName} を認識しました: ${title}`,
  relativePathResolveFailed: (location) =>
    [
      `相対 ark パスを解決できません: ${location}`,
      "現在サポートしている相対パスの基準は次の 2 種類だけです:",
      "1. 現在の .scp ファイルがあるディレクトリからの相対パス;",
      "2. 現在の workspace ルートからの相対パス。",
      "その他の暗黙の CWD に基づくパスは自動推測しません。"
    ].join("\n"),
  documentLinkOpen: (location) => `${location} を開く`,
  documentLinkResolve: (location) => `SCP ディレクトリまたは workspace ルートから ${location} を解決`,
  binaryOnly: "初期版では Kaldi binary ark entry のみサポートしています",
  unsupportedBinaryToken: (token) => `未対応の Kaldi binary token: ${token}`,
  readBinaryTokenFailed: "Kaldi binary token を読み取れません",
  unsupportedBasicTypeSize: (size) => `未対応の Kaldi basic type size tag: ${size}`,
  incompleteArkEntry: (expected, actual) =>
    `ark entry データが不完全です: ${expected} バイト必要ですが ${actual} バイトしか読めませんでした`
};

const KO: Messages = {
  ...EN,
  openArkInputTitle: "Kaldi Ark Entry 열기",
  openArkInputPrompt: "ark entry 위치를 입력하세요. 예: /path/to/wav.ark:23252",
  invalidArkLocation: (location) => `잘못된 ark entry 위치입니다: ${location}`,
  readArkEntryFailed: (message) => `ark entry를 읽을 수 없습니다: ${message}`,
  audioLensOpenFailed: (message) =>
    `AudioLens로 wav ark를 열 수 없습니다. simzhou.audiolens가 설치되고 활성화되어 있는지 확인하세요: ${message}`,
  nonAudioPreviewTitle: "Kaldi Reader 비오디오 ark entry 미리보기",
  nonAudioDetected: (title) => `Kaldi Reader가 비오디오 ark entry를 인식했습니다: ${title}`,
  recognizedArkEntry: (typeName, title) => `Kaldi Reader가 ${typeName}를 인식했습니다: ${title}`,
  relativePathResolveFailed: (location) =>
    [
      `상대 ark 경로를 해석할 수 없습니다: ${location}`,
      "현재 지원하는 상대 경로 기준은 두 가지뿐입니다:",
      "1. 현재 .scp 파일이 있는 디렉터리 기준;",
      "2. 현재 workspace 루트 기준.",
      "그 외 암묵적인 CWD 기반 경로는 자동으로 추측하지 않습니다."
    ].join("\n"),
  documentLinkOpen: (location) => `${location} 열기`,
  documentLinkResolve: (location) => `SCP 디렉터리 또는 workspace 루트에서 ${location} 해석`,
  binaryOnly: "초기 버전은 Kaldi binary ark entry만 지원합니다",
  unsupportedBinaryToken: (token) => `지원하지 않는 Kaldi binary token: ${token}`,
  readBinaryTokenFailed: "Kaldi binary token을 읽을 수 없습니다",
  unsupportedBasicTypeSize: (size) => `지원하지 않는 Kaldi basic type size tag: ${size}`,
  incompleteArkEntry: (expected, actual) =>
    `ark entry 데이터가 불완전합니다: ${expected}바이트가 필요하지만 ${actual}바이트를 읽었습니다`
};

const FR: Messages = {
  ...EN,
  openArkInputTitle: "Ouvrir une entrée ark Kaldi",
  openArkInputPrompt: "Saisissez l'emplacement d'une entrée ark, par exemple /path/to/wav.ark:23252",
  invalidArkLocation: (location) => `Emplacement d'entrée ark invalide : ${location}`,
  readArkEntryFailed: (message) => `Impossible de lire l'entrée ark : ${message}`,
  audioLensOpenFailed: (message) =>
    `Impossible d'ouvrir le wav ark avec AudioLens. Vérifiez que simzhou.audiolens est installé et activé : ${message}`,
  nonAudioPreviewTitle: "Aperçu d'entrée ark non audio Kaldi Reader",
  nonAudioDetected: (title) => `Kaldi Reader a reconnu une entrée ark non audio : ${title}`,
  recognizedArkEntry: (typeName, title) => `Kaldi Reader a reconnu ${typeName} : ${title}`,
  relativePathResolveFailed: (location) =>
    [
      `Impossible de résoudre le chemin ark relatif : ${location}`,
      "Seules deux bases de chemins relatifs sont prises en charge :",
      "1. Le dossier du fichier .scp courant ;",
      "2. La racine du workspace courant.",
      "Les autres chemins dépendant d'un CWD implicite ne sont pas devinés automatiquement."
    ].join("\n"),
  documentLinkOpen: (location) => `Ouvrir ${location}`,
  documentLinkResolve: (location) => `Résoudre ${location} depuis le dossier SCP ou la racine du workspace`
};

const DE: Messages = {
  ...EN,
  openArkInputTitle: "Kaldi-Ark-Entry öffnen",
  openArkInputPrompt: "Geben Sie eine ark-entry-Position ein, z. B. /path/to/wav.ark:23252",
  invalidArkLocation: (location) => `Ungültige ark-entry-Position: ${location}`,
  readArkEntryFailed: (message) => `Ark entry konnte nicht gelesen werden: ${message}`,
  audioLensOpenFailed: (message) =>
    `Wav ark konnte nicht mit AudioLens geöffnet werden. Stellen Sie sicher, dass simzhou.audiolens installiert und aktiviert ist: ${message}`,
  nonAudioPreviewTitle: "Kaldi Reader Vorschau für Nicht-Audio-ark-entry",
  nonAudioDetected: (title) => `Kaldi Reader hat einen Nicht-Audio-ark-entry erkannt: ${title}`,
  recognizedArkEntry: (typeName, title) => `Kaldi Reader hat ${typeName} erkannt: ${title}`,
  relativePathResolveFailed: (location) =>
    [
      `Relativer ark-Pfad konnte nicht aufgelöst werden: ${location}`,
      "Derzeit werden nur zwei relative Pfadbasen unterstützt:",
      "1. Relativ zum Verzeichnis der aktuellen .scp-Datei;",
      "2. Relativ zum aktuellen workspace-root.",
      "Andere implizite CWD-basierte Pfade werden nicht automatisch geraten."
    ].join("\n"),
  documentLinkOpen: (location) => `${location} öffnen`,
  documentLinkResolve: (location) => `${location} aus SCP-Verzeichnis oder workspace-root auflösen`
};

const ES: Messages = {
  ...EN,
  openArkInputTitle: "Abrir entrada ark de Kaldi",
  openArkInputPrompt: "Introduce la ubicación de una entrada ark, por ejemplo /path/to/wav.ark:23252",
  invalidArkLocation: (location) => `Ubicación de entrada ark no válida: ${location}`,
  readArkEntryFailed: (message) => `No se pudo leer la entrada ark: ${message}`,
  audioLensOpenFailed: (message) =>
    `No se pudo abrir el wav ark con AudioLens. Comprueba que simzhou.audiolens esté instalado y habilitado: ${message}`,
  nonAudioPreviewTitle: "Vista previa de entrada ark no audio de Kaldi Reader",
  nonAudioDetected: (title) => `Kaldi Reader reconoció una entrada ark no audio: ${title}`,
  recognizedArkEntry: (typeName, title) => `Kaldi Reader reconoció ${typeName}: ${title}`,
  relativePathResolveFailed: (location) =>
    [
      `No se pudo resolver la ruta ark relativa: ${location}`,
      "Actualmente solo se admiten dos bases para rutas relativas:",
      "1. Relativa al directorio del archivo .scp actual;",
      "2. Relativa a la raíz del workspace actual.",
      "No se adivinan automáticamente otras rutas basadas en un CWD implícito."
    ].join("\n"),
  documentLinkOpen: (location) => `Abrir ${location}`,
  documentLinkResolve: (location) => `Resolver ${location} desde el directorio SCP o la raíz del workspace`
};

const SHORT_LOCALES: Record<string, Messages> = {
  de: DE,
  es: ES,
  fr: FR,
  ja: JA,
  ko: KO,
  "zh-cn": ZH_CN,
  "zh-tw": ZH_TW,
  "zh-hk": ZH_TW,
  id: {
    ...EN,
    openArkInputTitle: "Buka Kaldi Ark Entry",
    openArkInputPrompt: "Masukkan lokasi ark entry, misalnya /path/to/wav.ark:23252",
    invalidArkLocation: (location) => `Lokasi ark entry tidak valid: ${location}`,
    readArkEntryFailed: (message) => `Gagal membaca ark entry: ${message}`,
    audioLensOpenFailed: (message) =>
      `Gagal membuka wav ark dengan AudioLens. Pastikan simzhou.audiolens terpasang dan aktif: ${message}`,
    nonAudioPreviewTitle: "Pratinjau ark entry non-audio Kaldi Reader",
    nonAudioDetected: (title) => `Kaldi Reader mengenali ark entry non-audio: ${title}`,
    recognizedArkEntry: (typeName, title) => `Kaldi Reader mengenali ${typeName}: ${title}`,
    relativePathResolveFailed: (location) =>
      [
        `Tidak dapat menyelesaikan path ark relatif: ${location}`,
        "Saat ini hanya dua basis path relatif yang didukung:",
        "1. Relatif terhadap direktori file .scp saat ini;",
        "2. Relatif terhadap root workspace saat ini.",
        "Path lain yang bergantung pada CWD implisit tidak ditebak otomatis."
      ].join("\n")
  },
  it: {
    ...EN,
    openArkInputTitle: "Apri voce ark Kaldi",
    openArkInputPrompt: "Inserisci la posizione di una voce ark, ad esempio /path/to/wav.ark:23252",
    invalidArkLocation: (location) => `Posizione della voce ark non valida: ${location}`,
    readArkEntryFailed: (message) => `Impossibile leggere la voce ark: ${message}`,
    audioLensOpenFailed: (message) =>
      `Impossibile aprire il wav ark con AudioLens. Verifica che simzhou.audiolens sia installato e abilitato: ${message}`,
    nonAudioPreviewTitle: "Anteprima voce ark non audio di Kaldi Reader",
    nonAudioDetected: (title) => `Kaldi Reader ha riconosciuto una voce ark non audio: ${title}`,
    recognizedArkEntry: (typeName, title) => `Kaldi Reader ha riconosciuto ${typeName}: ${title}`,
    relativePathResolveFailed: (location) =>
      [
        `Impossibile risolvere il percorso ark relativo: ${location}`,
        "Attualmente sono supportate solo due basi per i percorsi relativi:",
        "1. Relativa alla directory del file .scp corrente;",
        "2. Relativa alla root del workspace corrente.",
        "Altri percorsi basati su un CWD implicito non vengono indovinati automaticamente."
      ].join("\n")
  },
  nl: {
    ...EN,
    openArkInputTitle: "Kaldi ark-entry openen",
    openArkInputPrompt: "Voer een ark-entrylocatie in, bijvoorbeeld /path/to/wav.ark:23252",
    invalidArkLocation: (location) => `Ongeldige ark-entrylocatie: ${location}`,
    readArkEntryFailed: (message) => `Kan ark-entry niet lezen: ${message}`,
    audioLensOpenFailed: (message) =>
      `Kan wav ark niet openen met AudioLens. Controleer of simzhou.audiolens is geïnstalleerd en ingeschakeld: ${message}`,
    nonAudioPreviewTitle: "Kaldi Reader voorbeeld van niet-audio ark-entry",
    nonAudioDetected: (title) => `Kaldi Reader heeft een niet-audio ark-entry herkend: ${title}`,
    recognizedArkEntry: (typeName, title) => `Kaldi Reader heeft ${typeName} herkend: ${title}`,
    relativePathResolveFailed: (location) =>
      [
        `Kan relatief ark-pad niet oplossen: ${location}`,
        "Momenteel worden slechts twee relatieve padbasissen ondersteund:",
        "1. Relatief aan de map van het huidige .scp-bestand;",
        "2. Relatief aan de huidige workspace-root.",
        "Andere paden op basis van een impliciete CWD worden niet automatisch geraden."
      ].join("\n")
  },
  no: {
    ...EN,
    openArkInputTitle: "Åpne Kaldi ark-entry",
    openArkInputPrompt: "Skriv inn plasseringen til en ark-entry, for eksempel /path/to/wav.ark:23252",
    invalidArkLocation: (location) => `Ugyldig ark-entry-plassering: ${location}`,
    readArkEntryFailed: (message) => `Kunne ikke lese ark-entry: ${message}`,
    audioLensOpenFailed: (message) =>
      `Kunne ikke åpne wav ark med AudioLens. Kontroller at simzhou.audiolens er installert og aktivert: ${message}`,
    nonAudioPreviewTitle: "Kaldi Reader forhåndsvisning av ikke-lyd ark-entry",
    nonAudioDetected: (title) => `Kaldi Reader gjenkjente en ikke-lyd ark-entry: ${title}`,
    recognizedArkEntry: (typeName, title) => `Kaldi Reader gjenkjente ${typeName}: ${title}`,
    relativePathResolveFailed: (location) =>
      [
        `Kunne ikke løse relativ ark-sti: ${location}`,
        "For øyeblikket støttes bare to baser for relative stier:",
        "1. Relativt til katalogen for gjeldende .scp-fil;",
        "2. Relativt til gjeldende workspace-rot.",
        "Andre stier basert på implisitt CWD gjettes ikke automatisk."
      ].join("\n")
  },
  pl: {
    ...EN,
    openArkInputTitle: "Otwórz wpis ark Kaldi",
    openArkInputPrompt: "Wpisz lokalizację wpisu ark, np. /path/to/wav.ark:23252",
    invalidArkLocation: (location) => `Nieprawidłowa lokalizacja wpisu ark: ${location}`,
    readArkEntryFailed: (message) => `Nie można odczytać wpisu ark: ${message}`,
    audioLensOpenFailed: (message) =>
      `Nie można otworzyć wav ark w AudioLens. Upewnij się, że simzhou.audiolens jest zainstalowane i włączone: ${message}`,
    nonAudioPreviewTitle: "Podgląd nieaudio wpisu ark w Kaldi Reader",
    nonAudioDetected: (title) => `Kaldi Reader rozpoznał nieaudio wpis ark: ${title}`,
    recognizedArkEntry: (typeName, title) => `Kaldi Reader rozpoznał ${typeName}: ${title}`,
    relativePathResolveFailed: (location) =>
      [
        `Nie można rozwiązać względnej ścieżki ark: ${location}`,
        "Obecnie obsługiwane są tylko dwie bazy ścieżek względnych:",
        "1. Względem katalogu bieżącego pliku .scp;",
        "2. Względem katalogu głównego bieżącego workspace.",
        "Inne ścieżki oparte na niejawnym CWD nie są automatycznie zgadywane."
      ].join("\n")
  },
  pt: {
    ...EN,
    openArkInputTitle: "Abrir entrada ark Kaldi",
    openArkInputPrompt: "Insira a localização de uma entrada ark, por exemplo /path/to/wav.ark:23252",
    invalidArkLocation: (location) => `Localização de entrada ark inválida: ${location}`,
    readArkEntryFailed: (message) => `Falha ao ler a entrada ark: ${message}`,
    audioLensOpenFailed: (message) =>
      `Falha ao abrir o wav ark com AudioLens. Verifique se simzhou.audiolens está instalado e habilitado: ${message}`,
    nonAudioPreviewTitle: "Pré-visualização de entrada ark não áudio do Kaldi Reader",
    nonAudioDetected: (title) => `Kaldi Reader reconheceu uma entrada ark não áudio: ${title}`,
    recognizedArkEntry: (typeName, title) => `Kaldi Reader reconheceu ${typeName}: ${title}`,
    relativePathResolveFailed: (location) =>
      [
        `Não foi possível resolver o caminho ark relativo: ${location}`,
        "Atualmente, apenas duas bases de caminho relativo são suportadas:",
        "1. Relativa ao diretório do arquivo .scp atual;",
        "2. Relativa à raiz do workspace atual.",
        "Outros caminhos baseados em CWD implícito não são adivinhados automaticamente."
      ].join("\n")
  },
  ru: {
    ...EN,
    openArkInputTitle: "Открыть запись ark Kaldi",
    openArkInputPrompt: "Введите расположение записи ark, например /path/to/wav.ark:23252",
    invalidArkLocation: (location) => `Недопустимое расположение записи ark: ${location}`,
    readArkEntryFailed: (message) => `Не удалось прочитать запись ark: ${message}`,
    audioLensOpenFailed: (message) =>
      `Не удалось открыть wav ark через AudioLens. Убедитесь, что simzhou.audiolens установлен и включен: ${message}`,
    nonAudioPreviewTitle: "Предпросмотр неаудио записи ark в Kaldi Reader",
    nonAudioDetected: (title) => `Kaldi Reader распознал неаудио запись ark: ${title}`,
    recognizedArkEntry: (typeName, title) => `Kaldi Reader распознал ${typeName}: ${title}`,
    relativePathResolveFailed: (location) =>
      [
        `Не удалось разрешить относительный путь ark: ${location}`,
        "Сейчас поддерживаются только две базы относительных путей:",
        "1. Относительно каталога текущего файла .scp;",
        "2. Относительно корня текущего workspace.",
        "Другие пути, зависящие от неявного CWD, автоматически не угадываются."
      ].join("\n")
  },
  tr: {
    ...EN,
    openArkInputTitle: "Kaldi ark girdisini aç",
    openArkInputPrompt: "Bir ark girdisi konumu girin, örneğin /path/to/wav.ark:23252",
    invalidArkLocation: (location) => `Geçersiz ark girdisi konumu: ${location}`,
    readArkEntryFailed: (message) => `Ark girdisi okunamadı: ${message}`,
    audioLensOpenFailed: (message) =>
      `Wav ark AudioLens ile açılamadı. simzhou.audiolens kurulu ve etkin olduğundan emin olun: ${message}`,
    nonAudioPreviewTitle: "Kaldi Reader ses olmayan ark girdisi önizlemesi",
    nonAudioDetected: (title) => `Kaldi Reader ses olmayan bir ark girdisi tanıdı: ${title}`,
    recognizedArkEntry: (typeName, title) => `Kaldi Reader ${typeName} tanıdı: ${title}`,
    relativePathResolveFailed: (location) =>
      [
        `Göreli ark yolu çözülemedi: ${location}`,
        "Şu anda yalnızca iki göreli yol tabanı destekleniyor:",
        "1. Geçerli .scp dosyasının dizinine göre;",
        "2. Geçerli workspace köküne göre.",
        "Örtük CWD tabanlı diğer yollar otomatik olarak tahmin edilmez."
      ].join("\n")
  },
  vi: {
    ...EN,
    openArkInputTitle: "Mở mục ark Kaldi",
    openArkInputPrompt: "Nhập vị trí mục ark, ví dụ /path/to/wav.ark:23252",
    invalidArkLocation: (location) => `Vị trí mục ark không hợp lệ: ${location}`,
    readArkEntryFailed: (message) => `Không thể đọc mục ark: ${message}`,
    audioLensOpenFailed: (message) =>
      `Không thể mở wav ark bằng AudioLens. Hãy đảm bảo simzhou.audiolens đã được cài đặt và bật: ${message}`,
    nonAudioPreviewTitle: "Xem trước mục ark không phải âm thanh của Kaldi Reader",
    nonAudioDetected: (title) => `Kaldi Reader đã nhận dạng mục ark không phải âm thanh: ${title}`,
    recognizedArkEntry: (typeName, title) => `Kaldi Reader đã nhận dạng ${typeName}: ${title}`,
    relativePathResolveFailed: (location) =>
      [
        `Không thể phân giải đường dẫn ark tương đối: ${location}`,
        "Hiện chỉ hỗ trợ hai gốc đường dẫn tương đối:",
        "1. Tương đối với thư mục chứa file .scp hiện tại;",
        "2. Tương đối với root workspace hiện tại.",
        "Các đường dẫn dựa trên CWD ngầm định khác sẽ không được tự động đoán."
      ].join("\n")
  }
};

export function messages(): Messages {
  const language = vscode.env.language.toLowerCase();
  const exact = SHORT_LOCALES[language];
  if (exact) {
    return exact;
  }

  const base = SHORT_LOCALES[language.split("-")[0]];
  if (base) {
    return base;
  }

  return EN;
}
