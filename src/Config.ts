class Config {
    public static readonly COLOR_DOC = 0x1a5a7b
    public static readonly COLOR_PILOT = 0x932449
    public static readonly COLOR_BOX = 0x642493
    public static readonly HOST = window.localStorage.getItem('host')
}

const VbaoType = [
    {name: 'doc', color: Config.COLOR_DOC, label: '准'},
    {name: 'box', color: Config.COLOR_BOX, label: '韧'},
    {name: 'pilot', color: Config.COLOR_PILOT, label: '敢'}
]