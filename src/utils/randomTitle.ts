export default function getRandomTitle(): string {
    const adjectives = [
        'Hidden',
        'Ancient',
        'Furious',
        'Silent',
        'Elegant',
        'Broken',
        'Vast',
        'Distant',
        'Cosmic',
        'Crimson',
        'Golden',
        'Shadowy',
        'Lost',
        'Wicked',
        'Radiant',
        'Flickering',
        'Delicate',
        'Bold',
        'Timeless',
        'Fractured',
    ];

    const nouns = [
        'Dream',
        'Empire',
        'Forest',
        'Secret',
        'Fire',
        'Storm',
        'Memory',
        'Path',
        'Galaxy',
        'Whisper',
        'Echo',
        'Horizon',
        'Vision',
        'Labyrinth',
        'Pulse',
        'Mirage',
        'Ruin',
        'Requiem',
        'Signal',
        'Light',
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adjective} ${noun}`;
}
