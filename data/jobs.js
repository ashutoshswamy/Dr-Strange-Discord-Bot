module.exports = {
  // Entry Level - No requirements
  apprentice: { 
    pay: 100, 
    description: 'Learn the basics of the mystic arts',
    requirement: null,
    requirementText: 'No requirements'
  },
  
  // Kamar-Taj & Sanctum roles - Require apprentice experience or balance
  sorcerer: { 
    pay: 200, 
    description: 'Practice the mystic arts at Kamar-Taj',
    requirement: { type: 'job', job: 'apprentice' },
    requirementText: 'Must have worked as Apprentice'
  },
  archivist: { 
    pay: 150, 
    description: 'Catalog ancient texts in the library',
    requirement: { type: 'balance', amount: 500 },
    requirementText: 'Requires 500 ME balance'
  },
  librarian: { 
    pay: 180, 
    description: 'Maintain the forbidden section at Kamar-Taj',
    requirement: { type: 'job', job: 'archivist' },
    requirementText: 'Must have worked as Archivist'
  },
  herbalist: { 
    pay: 170, 
    description: 'Prepare mystical potions and remedies',
    requirement: { type: 'balance', amount: 300 },
    requirementText: 'Requires 300 ME balance'
  },
  
  // Mid-tier mystical professions
  guardian: { 
    pay: 300, 
    description: 'Protect a Sanctum from interdimensional threats',
    requirement: { type: 'job', job: 'sorcerer' },
    requirementText: 'Must have worked as Sorcerer'
  },
  enchanter: { 
    pay: 250, 
    description: 'Imbue relics with mystical energy',
    requirement: { type: 'balance', amount: 1000 },
    requirementText: 'Requires 1,000 ME balance'
  },
  portalkeeper: { 
    pay: 220, 
    description: 'Maintain sling ring portals across dimensions',
    requirement: { type: 'job', job: 'sorcerer' },
    requirementText: 'Must have worked as Sorcerer'
  },
  runesmith: { 
    pay: 230, 
    description: 'Inscribe protective runes and wards',
    requirement: { type: 'job', job: 'enchanter' },
    requirementText: 'Must have worked as Enchanter'
  },
  
  // Advanced roles
  relicmaster: { 
    pay: 350, 
    description: 'Care for powerful artifacts like the Cloak of Levitation',
    requirement: { type: 'balance', amount: 2500 },
    requirementText: 'Requires 2,500 ME balance'
  },
  astralscout: { 
    pay: 280, 
    description: 'Gather intel in the Astral Plane',
    requirement: { type: 'job', job: 'guardian' },
    requirementText: 'Must have worked as Guardian'
  },
  timewatcher: { 
    pay: 320, 
    description: 'Monitor the timestream for anomalies',
    requirement: { type: 'balance', amount: 3000 },
    requirementText: 'Requires 3,000 ME balance'
  },
  
  // Expert roles
  dimensionnaut: { 
    pay: 400, 
    description: 'Explore the Dark Dimension and beyond',
    requirement: { type: 'job', job: 'astralscout' },
    requirementText: 'Must have worked as Astral Scout'
  },
  voidhunter: { 
    pay: 450, 
    description: 'Track and capture entities from the void',
    requirement: { type: 'balance', amount: 5000 },
    requirementText: 'Requires 5,000 ME balance'
  },
  
  // Elite role
  sanctummaster: { 
    pay: 500, 
    description: 'Oversee operations of an entire Sanctum',
    requirement: { type: 'job', job: 'dimensionnaut' },
    requirementText: 'Must have worked as Dimensionnaut'
  },
};

