export type TranslationKeys = {
  // App
  appTitle: string;
  footerText: string;
  videoGeneratorTab: string;
  imageEditorTab: string;
  veo3PromptGeneratorTab: string;
  
  // Video Generator
  videoGenerationSettings: string;
  settingsTitle: string;
  scenesTitle: string;
  scenesLabel: string;
  promptLabel: string;
  promptPlaceholder: string;
  veoModelLabel: string;
  visualStyleLabel: string;
  styleRealistic: string;
  styleCinematic: string;
  styleAnime: string;
  stylePixar3D: string;
  styleCyberpunk: string;
  styleRetro80s: string;
  characterVoiceLabel: string;
  voiceNone: string;
  voiceEnglish: string;
  voiceIndonesian: string;
  aspectRatioLabel: string;
  aspectRatio16x9: string;
  aspectRatio9x16: string;
  aspectRatio1x1: string;
  resolutionLabel: string;
  resolution720p: string;
  resolution1080p: string;
  enableSoundLabel: string;
  generatingButton: string;
  generateVideoButton: string;
  errorTitle: string;
  generationFailedError: string;
  videoPlaceholder: string;
  promptRequiredError: string;
  promptRequiredForSceneError: string;
  addSceneButton: string;
  usePreviousSceneLabel: string;
  sceneLabel: string;
  generatingScene: string;
  generatingSceneShort: string;
  scenePending: string;
  resultsTitle: string;
  stopButton: string;
  stoppingButton: string;
  generationStoppedByUser: string;
  jsonPromptCheckboxLabel: string;
  jsonPromptInfoText: string;

  // Video Player
  downloadVideoButton: string;
  createAnotherButton: string;

  // History (shared)
  historyTitle: string;

  // Video History
  loadSettingsButton: string;
  playVideoButton: string;
  deleteFromHistoryButton: string;
  clearHistoryButton: string;
  noHistoryMessage: string;
  confirmClearHistory: string;
  videoPreviewTitle: string;

  // Image History
  imageHistoryTitle: string;
  loadImageSettingsButton: string;
  previewImageButton: string;
  downloadImageButton: string;
  deleteFromImageHistoryButton: string;
  clearImageHistoryButton: string;
  noImageHistoryMessage: string;
  confirmClearImageHistory: string;


  // Image Uploader
  removeButton: string;
  changeImageButton: string;
  addMoreImagesButton: string;
  uploadMultipleImagesHint: string;
  uploadSingleImageHint: string;
  browseFilesButton: string;

  // Image Editor
  imageModelLabel: string;
  imageEditingSettings: string;
  editInstructionLabel: string;
  editInstructionPlaceholder: string;
  editingButton: string;
  generateEditButton: string;
  generateImageButton: string;
  generatingImageMessage: string;
  clearButton: string;
  originalsTitle: string;
  uploadImageToStart: string;
  editedTitle: string;
  generatedTitle: string;
  editingFailedError: string;
  imageEditedPlaceholder: string;
  imageGeneratedPlaceholder: string;
  previewButton: string;
  downloadButton: string;
  instructionRequiredError: string;
  imageRequiredError: string;

  // Image Preview Window
  imagePreviewTitle: string;
  imagePreviewAlt: string;
  closePreviewLabel: string;

  // JSON Import Modal
  importJsonTitle: string;
  importJsonDescription: string;
  importJsonDescriptionSingle: string;
  importJsonPlaceholder: string;
  cancelButton: string;
  importButton: string;
  jsonEmptyError: string;
  jsonFormatError: string;
  jsonInvalidObjectFormatError: string;
  jsonInvalidError: string;
  jsonSingleSceneError: string;

  // Loading Screen
  generatingVideoTitle: string;
  loadingMessage1: string;
  loadingMessage2:string;
  loadingMessage3:string;
  loadingMessage4:string;
  loadingMessage5:string;
  loadingMessage6:string;
  loadingMessage7:string;
  loadingMessage8:string;

  // Language Switcher
  languageEnglish: string;
  languageIndonesian: string;

  // VEO3 Prompt Generator
  characterSectionTitle: string;
  characterLabel: string;
  addCharacterButton: string;
  raceLabel: string;
  customRaceLabel: string;
  genderLabel: string;
  ageLabel: string;
  outfitLabel: string;
  hairstyleLabel: string;
  voiceLabel: string;
  descriptionActionLabel: string;
  referenceImageLabel: string;
  analyzeImageButton: string;
  analyzingButton: string;
  analysisError: string;
  dialogueSectionTitle: string;
  addDialogueButton: string;
  dialogueCharacterLabel: string;
  dialogueTextLabel: string;
  environmentCameraSectionTitle: string;
  environmentDescLabel: string;
  visualStylePromptLabel: string;
  lightingLabel: string;
  cameraAngleLabel: string;
  shotTypeLabel: string;
  outputSectionTitle: string;
  indonesianPromptTitle: string;
  englishPromptTitle: string;
  jsonPromptTitle: string;
  copyButton: string;
  copiedButton: string;
  otherOption: string;

  // API Key Manager
  apiKeyManagerTitle: string;
  apiKeyInputLabel: string;
  apiKeyInputPlaceholder: string;
  saveApiKeyButton: string;
  removeApiKeyButton: string;
  apiKeySavedSuccess: string;
  apiKeyRemovedSuccess: string;
  apiKeySecurityWarning: string;
  apiKeyMissingError: string;
};

type TranslationValues = { [key: string]: string | number };

export const translations: Record<'en' | 'id', TranslationKeys> = {
  en: {
    appTitle: 'VEO Video Generator',
    footerText: 'Powered by Google Gemini. UI designed for creativity.',
    videoGeneratorTab: 'Video Generator',
    imageEditorTab: 'Image Editor',
    veo3PromptGeneratorTab: 'VEO3 Prompt Generator',
    videoGenerationSettings: 'Video Generation Settings',
    settingsTitle: 'Settings',
    scenesTitle: 'Scenes',
    scenesLabel: 'Scenes',
    promptLabel: 'Prompt',
    promptPlaceholder: 'Describe your scene...',
    veoModelLabel: 'Model',
    visualStyleLabel: 'Visual Style',
    styleRealistic: 'Realistic',
    styleCinematic: 'Cinematic',
    styleAnime: 'Anime',
    stylePixar3D: 'Pixar 3D',
    styleCyberpunk: 'Cyberpunk',
    styleRetro80s: "Retro 80's",
    characterVoiceLabel: 'Character Voice',
    voiceNone: 'None',
    voiceEnglish: 'English',
    voiceIndonesian: 'Bahasa Indonesia',
    aspectRatioLabel: 'Aspect Ratio',
    aspectRatio16x9: '16:9',
    aspectRatio9x16: '9:16',
    aspectRatio1x1: '1:1',
    resolutionLabel: 'Resolution',
    resolution720p: '720p',
    resolution1080p: '1080p',
    enableSoundLabel: 'Sound',
    generatingButton: 'Generating...',
    generateVideoButton: 'Generate',
    errorTitle: 'Error',
    generationFailedError: 'Generation Failed:',
    videoPlaceholder: 'Your generated videos will appear here.',
    promptRequiredError: 'Please enter a prompt.',
    promptRequiredForSceneError: 'Please enter a prompt for all scenes.',
    addSceneButton: 'Add Scene',
    usePreviousSceneLabel: 'Use last frame',
    sceneLabel: 'Scene',
    generatingScene: 'Generating Scene {current} of {total}...',
    generatingSceneShort: 'Generating...',
    scenePending: 'Queued',
    resultsTitle: 'Results',
    stopButton: 'Stop',
    stoppingButton: 'Stopping...',
    generationStoppedByUser: 'Generation was stopped by the user.',
    jsonPromptCheckboxLabel: 'JSON Prompt',
    jsonPromptInfoText: '(check if prompt is JSON)',
    downloadVideoButton: 'Download',
    createAnotherButton: 'Start New Project',
    historyTitle: 'History',
    loadSettingsButton: 'Load',
    playVideoButton: 'Play',
    deleteFromHistoryButton: 'Delete',
    clearHistoryButton: 'Clear All',
    noHistoryMessage: 'Your generated videos will appear here in your history.',
    confirmClearHistory: 'Are you sure you want to delete all history? This cannot be undone.',
    videoPreviewTitle: 'Video Preview',
    imageHistoryTitle: 'Image History',
    loadImageSettingsButton: 'Load',
    previewImageButton: 'Preview',
    downloadImageButton: 'Download',
    deleteFromImageHistoryButton: 'Delete',
    clearImageHistoryButton: 'Clear All',
    noImageHistoryMessage: 'Your generated images will appear here.',
    confirmClearImageHistory: 'Are you sure you want to delete all image history? This cannot be undone.',
    removeButton: 'Remove',
    changeImageButton: 'Change',
    addMoreImagesButton: 'Add More',
    uploadMultipleImagesHint: 'Upload one or more reference images',
    uploadSingleImageHint: 'Click or Drop to upload an image',
    browseFilesButton: 'Browse Files',
    imageModelLabel: 'Image Model',
    imageEditingSettings: 'Image Editing Settings',
    editInstructionLabel: 'Edit Instruction',
    editInstructionPlaceholder: 'e.g., Add a llama next to the person',
    editingButton: 'Editing...',
    generateEditButton: 'Generate Edit',
    generateImageButton: 'Generate Image',
    generatingImageMessage: 'Generating your image...',
    clearButton: 'Clear',
    originalsTitle: 'Original(s)',
    uploadImageToStart: 'Upload an image to start',
    editedTitle: 'Edited',
    generatedTitle: 'Generated',
    editingFailedError: 'Editing Failed:',
    imageEditedPlaceholder: 'Your edited image will appear here.',
    imageGeneratedPlaceholder: 'Your generated image will appear here.',
    previewButton: 'Preview',
    downloadButton: 'Download',
    instructionRequiredError: 'Please enter an editing instruction.',
    imageRequiredError: 'Please upload at least one image to edit.',
    imagePreviewTitle: 'Image Preview',
    imagePreviewAlt: 'Generated Preview',
    closePreviewLabel: 'Close preview',
    importJsonTitle: 'Import Scenes from JSON',
    importJsonDescription: 'Paste a JSON array of scene objects (e.g., `[{"prompt": "..."}]`) or a single detailed prompt object to import multiple scenes.',
    importJsonDescriptionSingle: 'Paste a JSON object with a `prompt` key, or a detailed prompt object, to import a single scene.',
    importJsonPlaceholder: 'Paste JSON here...',
    cancelButton: 'Cancel',
    importButton: 'Import',
    jsonEmptyError: 'JSON is empty or contains no valid scenes.',
    jsonFormatError: 'Invalid scene format in JSON array.',
    jsonInvalidObjectFormatError: 'Invalid JSON object. Must contain text values to form a prompt.',
    jsonInvalidError: 'Invalid JSON format.',
    jsonSingleSceneError: 'Only a single scene can be imported in this mode.',
    generatingVideoTitle: 'Generating Your Video',
    loadingMessage1: "Warming up the VEO engine...",
    loadingMessage2: "Composing your visual story...",
    loadingMessage3: "Rendering pixels into motion...",
    loadingMessage4: "This can take a few minutes, please be patient.",
    loadingMessage5: "Analyzing your creative prompt...",
    loadingMessage6: "Gathering visual elements...",
    loadingMessage7: "The final result will be worth the wait!",
    loadingMessage8: "Stitching frames together...",
    languageEnglish: 'English',
    languageIndonesian: 'Bahasa Indonesia',
    characterSectionTitle: 'Character',
    characterLabel: 'Character',
    addCharacterButton: 'Add Character',
    raceLabel: 'Race/Ethnicity',
    customRaceLabel: 'Custom Race',
    genderLabel: 'Gender',
    ageLabel: 'Age',
    outfitLabel: 'Outfit',
    hairstyleLabel: 'Hairstyle',
    voiceLabel: 'Voice',
    descriptionActionLabel: 'Description & Action',
    referenceImageLabel: 'Reference Image (Optional)',
    analyzeImageButton: 'Analyze Image',
    analyzingButton: 'Analyzing...',
    analysisError: 'Analysis failed. Please try again.',
    dialogueSectionTitle: 'Dialogue',
    addDialogueButton: 'Add Dialogue',
    dialogueCharacterLabel: 'Character',
    dialogueTextLabel: 'Dialogue Text',
    environmentCameraSectionTitle: 'Environment & Camera',
    environmentDescLabel: 'Environment Description',
    visualStylePromptLabel: 'Visual Style',
    lightingLabel: 'Lighting',
    cameraAngleLabel: 'Camera Angle',
    shotTypeLabel: 'Shot Type',
    outputSectionTitle: 'Generated Prompt',
    indonesianPromptTitle: 'Indonesian Prompt',
    englishPromptTitle: 'English Prompt',
    jsonPromptTitle: 'JSON Prompt',
    copyButton: 'Copy',
    copiedButton: 'Copied!',
    otherOption: 'Other...',
    // API Key Manager
    apiKeyManagerTitle: 'Gemini API Key Management',
    apiKeyInputLabel: 'Your Gemini API Key',
    apiKeyInputPlaceholder: 'Paste your API key here',
    saveApiKeyButton: 'Save Key',
    removeApiKeyButton: 'Remove Key',
    apiKeySavedSuccess: 'API Key saved successfully!',
    apiKeyRemovedSuccess: 'API Key removed successfully.',
    apiKeySecurityWarning: 'Warning: Your API key is stored in your browser\'s local storage. Do not use this on a public or shared computer.',
    apiKeyMissingError: 'Gemini API key is not set. Please set it in the management section above.',
  },
  id: {
    appTitle: 'VEO Video Generator',
    footerText: 'Didukung oleh Google Gemini. UI dirancang untuk kreativitas.',
    videoGeneratorTab: 'Generator Video',
    imageEditorTab: 'Editor Gambar',
    veo3PromptGeneratorTab: 'Generator Prompt VEO3',
    videoGenerationSettings: 'Pengaturan Pembuatan Video',
    settingsTitle: 'Pengaturan',
    scenesTitle: 'Adegan',
    scenesLabel: 'Adegan',
    promptLabel: 'Prompt',
    promptPlaceholder: 'Jelaskan adegan Anda...',
    veoModelLabel: 'Model',
    visualStyleLabel: 'Gaya Visual',
    styleRealistic: 'Realistik',
    styleCinematic: 'Sinematik',
    styleAnime: 'Anime',
    stylePixar3D: 'Pixar 3D',
    styleCyberpunk: 'Cyberpunk',
    styleRetro80s: "Retro 80-an",
    characterVoiceLabel: 'Suara Karakter',
    voiceNone: 'Tidak ada',
    voiceEnglish: 'Bahasa Inggris',
    voiceIndonesian: 'Bahasa Indonesia',
    aspectRatioLabel: 'Rasio Aspek',
    aspectRatio16x9: '16:9',
    aspectRatio9x16: '9:16',
    aspectRatio1x1: '1:1',
    resolutionLabel: 'Resolusi',
    resolution720p: '720p',
    resolution1080p: '1080p',
    enableSoundLabel: 'Suara',
    generatingButton: 'Membuat...',
    generateVideoButton: 'Buat Video',
    errorTitle: 'Kesalahan',
    generationFailedError: 'Pembuatan Gagal:',
    videoPlaceholder: 'Video yang Anda buat akan muncul di sini.',
    promptRequiredError: 'Silakan masukkan prompt.',
    promptRequiredForSceneError: 'Silakan masukkan prompt untuk semua adegan.',
    addSceneButton: 'Tambah Adegan',
    usePreviousSceneLabel: 'Gunakan frame terakhir',
    sceneLabel: 'Adegan',
    generatingScene: 'Membuat Adegan {current} dari {total}...',
    generatingSceneShort: 'Membuat...',
    scenePending: 'Dalam antrian',
    resultsTitle: 'Hasil',
    stopButton: 'Hentikan',
    stoppingButton: 'Menghentikan...',
    generationStoppedByUser: 'Pembuatan dihentikan oleh pengguna.',
    jsonPromptCheckboxLabel: 'Prompt JSON',
    jsonPromptInfoText: '(centang jika prompt adalah JSON)',
    downloadVideoButton: 'Unduh',
    createAnotherButton: 'Mulai Proyek Baru',
    historyTitle: 'Riwayat',
    loadSettingsButton: 'Muat',
    playVideoButton: 'Putar',
    deleteFromHistoryButton: 'Hapus',
    clearHistoryButton: 'Bersihkan Semua',
    noHistoryMessage: 'Video yang Anda buat akan muncul di riwayat Anda di sini.',
    confirmClearHistory: 'Apakah Anda yakin ingin menghapus semua riwayat? Tindakan ini tidak dapat dibatalkan.',
    videoPreviewTitle: 'Pratinjau Video',
    imageHistoryTitle: 'Riwayat Gambar',
    loadImageSettingsButton: 'Muat',
    previewImageButton: 'Pratinjau',
    downloadImageButton: 'Unduh',
    deleteFromImageHistoryButton: 'Hapus',
    clearImageHistoryButton: 'Bersihkan Semua',
    noImageHistoryMessage: 'Gambar yang Anda buat akan muncul di sini.',
    confirmClearImageHistory: 'Apakah Anda yakin ingin menghapus semua riwayat gambar? Tindakan ini tidak dapat dibatalkan.',
    removeButton: 'Hapus',
    changeImageButton: 'Ganti',
    addMoreImagesButton: 'Tambah Lagi',
    uploadMultipleImagesHint: 'Unggah satu atau lebih gambar referensi',
    uploadSingleImageHint: 'Klik atau Lepas untuk mengunggah gambar',
    browseFilesButton: 'Cari File',
    imageModelLabel: 'Model Gambar',
    imageEditingSettings: 'Pengaturan Edit Gambar',
    editInstructionLabel: 'Instruksi Edit',
    editInstructionPlaceholder: 'contoh: Tambahkan llama di sebelah orang itu',
    editingButton: 'Mengedit...',
    generateEditButton: 'Buat Editan',
    generateImageButton: 'Buat Gambar',
    generatingImageMessage: 'Sedang membuat gambar Anda...',
    clearButton: 'Bersihkan',
    originalsTitle: 'Asli',
    uploadImageToStart: 'Unggah gambar untuk memulai',
    editedTitle: 'Diedit',
    generatedTitle: 'Dihasilkan',
    editingFailedError: 'Pengeditan Gagal:',
    imageEditedPlaceholder: 'Gambar yang diedit akan muncul di sini.',
    imageGeneratedPlaceholder: 'Gambar yang dihasilkan akan muncul di sini.',
    previewButton: 'Pratinjau',
    downloadButton: 'Unduh',
    instructionRequiredError: 'Silakan masukkan instruksi pengeditan.',
    imageRequiredError: 'Silakan unggah setidaknya satu gambar untuk diedit.',
    imagePreviewTitle: 'Pratinjau Gambar',
    imagePreviewAlt: 'Pratinjau yang Dihasilkan',
    closePreviewLabel: 'Tutup pratinjau',
    importJsonTitle: 'Impor Adegan dari JSON',
    importJsonDescription: 'Tempel array JSON dari objek adegan (misalnya, `[{"prompt": "..."}]`) atau objek prompt terperinci tunggal untuk mengimpor beberapa adegan.',
    importJsonDescriptionSingle: 'Tempel objek JSON dengan kunci `prompt`, atau objek prompt terperinci, untuk mengimpor satu adegan.',
    importJsonPlaceholder: 'Tempel JSON di sini...',
    cancelButton: 'Batal',
    importButton: 'Impor',
    jsonEmptyError: 'JSON kosong atau tidak berisi adegan yang valid.',
    jsonFormatError: 'Format adegan tidak valid dalam array JSON.',
    jsonInvalidObjectFormatError: 'Objek JSON tidak valid. Harus berisi nilai teks untuk membentuk prompt.',
    jsonInvalidError: 'Format JSON tidak valid.',
    jsonSingleSceneError: 'Hanya satu adegan yang dapat diimpor dalam mode ini.',
    generatingVideoTitle: 'Membuat Video Anda',
    loadingMessage1: "Memanaskan mesin VEO...",
    loadingMessage2: "Menyusun cerita visual Anda...",
    loadingMessage3: "Merender piksel menjadi gerakan...",
    loadingMessage4: "Ini bisa memakan waktu beberapa menit, harap bersabar.",
    loadingMessage5: "Menganalisis prompt kreatif Anda...",
    loadingMessage6: "Mengumpulkan elemen visual...",
    loadingMessage7: "Hasil akhirnya akan sepadan dengan penantian!",
    loadingMessage8: "Menyatukan frame...",
    languageEnglish: 'English',
    languageIndonesian: 'Bahasa Indonesia',
    characterSectionTitle: 'Karakter',
    characterLabel: 'Karakter',
    addCharacterButton: 'Tambah Karakter',
    raceLabel: 'Ras/Etnis',
    customRaceLabel: 'Ras Kustom',
    genderLabel: 'Gender',
    ageLabel: 'Usia',
    outfitLabel: 'Pakaian',
    hairstyleLabel: 'Gaya Rambut',
    voiceLabel: 'Suara',
    descriptionActionLabel: 'Deskripsi & Aksi',
    referenceImageLabel: 'Gambar Referensi (Opsional)',
    analyzeImageButton: 'Analisis Gambar',
    analyzingButton: 'Menganalisis...',
    analysisError: 'Analisis gagal. Silakan coba lagi.',
    dialogueSectionTitle: 'Dialog',
    addDialogueButton: 'Tambah Dialog',
    dialogueCharacterLabel: 'Karakter',
    dialogueTextLabel: 'Teks Dialog',
    environmentCameraSectionTitle: 'Lingkungan & Kamera',
    environmentDescLabel: 'Deskripsi Lingkungan',
    visualStylePromptLabel: 'Gaya Visual',
    lightingLabel: 'Pencahayaan',
    cameraAngleLabel: 'Sudut Kamera',
    shotTypeLabel: 'Tipe Pengambilan Gambar',
    outputSectionTitle: 'Prompt yang Dihasilkan',
    indonesianPromptTitle: 'Prompt Bahasa Indonesia',
    englishPromptTitle: 'Prompt Bahasa Inggris',
    jsonPromptTitle: 'Prompt JSON',
    copyButton: 'Salin',
    copiedButton: 'Tersalin!',
    otherOption: 'Lainnya...',
    // API Key Manager
    apiKeyManagerTitle: 'Manajemen Kunci API Gemini',
    apiKeyInputLabel: 'Kunci API Gemini Anda',
    apiKeyInputPlaceholder: 'Tempel kunci API Anda di sini',
    saveApiKeyButton: 'Simpan Kunci',
    removeApiKeyButton: 'Hapus Kunci',
    apiKeySavedSuccess: 'Kunci API berhasil disimpan!',
    apiKeyRemovedSuccess: 'Kunci API berhasil dihapus.',
    apiKeySecurityWarning: 'Peringatan: Kunci API Anda disimpan di penyimpanan lokal browser Anda. Jangan gunakan ini di komputer umum atau yang digunakan bersama.',
    apiKeyMissingError: 'Kunci API Gemini belum diatur. Silakan atur di bagian manajemen di atas.',
  },
};