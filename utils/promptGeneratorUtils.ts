import { Character, Dialogue, EnvironmentSettings } from '../types';

export const generatePrompts = (
  characters: Character[],
  dialogues: Dialogue[],
  environment: EnvironmentSettings
): { indonesian: string; english: string; json: string } => {
  if (characters.length === 0 && dialogues.length === 0 && !environment.description && !environment.visualStyle) {
    return { indonesian: '', english: '', json: '' };
  }

  // --- JSON Generation ---
  const jsonData = {
    scene: {
      environment: {
        description: environment.description,
        visual_style: environment.visualStyle,
        lighting: environment.lighting,
      },
      camera: {
        angle: environment.cameraAngle,
        shot_type: environment.shotType,
      },
      characters: characters.map((c, i) => ({
        name: `Karakter ${i + 1}`,
        details: {
          race: c.race === 'Other...' ? c.customRace : c.race,
          gender: c.gender,
          age: c.age,
          outfit: c.outfit,
          hairstyle: c.hairstyle,
          voice: c.voice,
          action: c.description,
        },
      })),
      dialogue: dialogues.map(d => {
        const charIndex = characters.findIndex(c => c.id === d.characterId);
        return {
          speaker: `Karakter ${charIndex + 1}`,
          line: d.text,
        };
      }),
    },
  };
  const json = JSON.stringify(jsonData, null, 2);

  // --- Indonesian Prompt Generation ---
  let indonesian = '';
  if (environment.description) indonesian += `Sebuah adegan di ${environment.description}. `;
  if (environment.visualStyle) indonesian += `Gaya visualnya adalah ${environment.visualStyle}. `;
  if (environment.lighting) indonesian += `Pencahayaan ${environment.lighting}. `;
  if (environment.cameraAngle && environment.shotType) {
    indonesian += `Pengambilan gambar menggunakan ${environment.shotType} dengan ${environment.cameraAngle}. `;
  }

  if (characters.length > 0) {
    indonesian += `\n\nKarakter yang terlibat:\n`;
    characters.forEach((c, i) => {
      let charDesc = `- Karakter ${i + 1}: Seorang ${c.gender} ras ${c.race === 'Other...' ? c.customRace : c.race}, diperkirakan berusia ${c.age || 'tidak diketahui'} tahun. Mengenakan ${c.outfit || 'pakaian tidak dijelaskan'}, dengan gaya rambut ${c.hairstyle || 'tidak dijelaskan'}. Suaranya ${c.voice}. Aksi/deskripsi: ${c.description || 'tidak ada'}.\n`;
      indonesian += charDesc;
    });
  }

  if (dialogues.length > 0) {
    indonesian += `\nDialog:\n`;
    dialogues.forEach(d => {
      const charIndex = characters.findIndex(c => c.id === d.characterId);
      if (charIndex !== -1) {
        indonesian += `Karakter ${charIndex + 1}: "${d.text}"\n`;
      }
    });
  }


  // --- English Prompt Generation ---
  let english = '';
  if (environment.description) english += `A scene at ${environment.description}. `;
  if (environment.visualStyle) english += `The visual style is ${environment.visualStyle}. `;
  if (environment.lighting) english += `The lighting is ${environment.lighting}. `;
  if (environment.cameraAngle && environment.shotType) {
    english += `The shot is a ${environment.shotType} with a ${environment.cameraAngle}. `;
  }
  
  if (characters.length > 0) {
    english += `\n\nCharacters involved:\n`;
    characters.forEach((c, i) => {
      let genderEn = c.gender === 'Pria' ? 'male' : c.gender === 'Wanita' ? 'female' : 'non-binary';
      let charDesc = `- Character ${i + 1}: A ${genderEn} of ${c.race === 'Other...' ? c.customRace : c.race} ethnicity, estimated to be ${c.age || 'unknown'} years old. Wearing ${c.outfit || 'unspecified clothing'}, with a ${c.hairstyle || 'unspecified'} hairstyle. Their voice is ${c.voice}. Action/description: ${c.description || 'none'}.\n`;
      english += charDesc;
    });
  }

  if (dialogues.length > 0) {
    english += `\nDialogue:\n`;
    dialogues.forEach(d => {
      const charIndex = characters.findIndex(c => c.id === d.characterId);
      if (charIndex !== -1) {
        english += `Character ${charIndex + 1}: "${d.text}"\n`;
      }
    });
  }


  return { indonesian: indonesian.trim(), english: english.trim(), json };
};
