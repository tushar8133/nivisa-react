export const LEGO = [
	{
		id: 'GET_DEVICE_LIST',
		desc: 'Getting device connections',
		delay: '3'
	},
	{
		id: '*IDN?',
		desc: 'Checking device name',
		delay: '10'
	},
	{
		id: ':INSTrument:CATalog:FULL?',
		desc: 'Checking all supported modes',
		delay: '10'
	},
	{
		id: ':INSTrument:NSELect 46',
		desc: 'Setting PIM Analyzer mode',
		delay: '35'
	},
	{
		id: ':INSTrument:NSELect?',
		desc: 'Checking current mode',
		delay: '10'
	},
	{
		id: ':PIManalyzer:MODe PIM',
		desc: 'Setting PIM vs Time Measurement',
		delay: '10'
	},
	{
		id: ':PIManalyzer:MODe SPECTRUM_VIEW',
		desc: 'Setting Noise Floor',
		delay: '10'
	},
	{
		id: ':PIManalyzer:MODe DTP',
		desc: 'Setting Distance to PIM',
		delay: '10'
	},
	{
		id: ':PIManalyzer:MODe PIMSwp',
		desc: 'Setting Swept PIM',
		delay: '10'
	},
	{
		id: ':CALibration:PIManalyzer:FULL ON',
		desc: 'Starting Calibration',
		delay: '10'
	},
	{
		id:':INITiate:PIManalyzer:PVT:ALLPower:CAL',
		desc: 'Calibrating in progress',
		delay: '60'
	},
	{
		id: ':CALibration:PIManalyzer:FULL?',
		desc: 'Checking Calibration',
		delay: '10'
	},
	{
		id: ':PIManalyzer:OUTPut:POWer',
		desc: 'Setting Power',
		delay: '1'
	},
	{
		id: ':PIManalyzer:TEST:DURation',
		desc: 'Setting Duration',
		delay: '1'
	},
	{
		id: 'INITiate:PIManalyzer:MEASure ON',
		desc: 'RF ON',
		delay: '-1'
	},
	{
		id: ':PIManalyzer:MEASure:STATus?',
		desc: 'Checking RF Status',
		delay: '10'
	},
	{
		id: ':PIManalyzer:MEASure:VALue?',
		desc: 'Checking Measured Values',
		delay: '10'
	},
	{
		id: ':PIManalyzer:FREQuency:F1?',
		desc: 'Checking Frequency Tone 1',
		delay: '10'
	},
	{
		id: ':PIManalyzer:FREQuency:F2?',
		desc: 'Checking Frequency Tone 2',
		delay: '10'
	},
	{
		id: ':PIManalyzer:IMD:ORDer 3',
		desc: 'Setting PIM3 Order',
		delay: '3'
	},
	{
		id: ':PIManalyzer:IMD:ORDer 5',
		desc: 'Setting PIM5 Order',
		delay: '3'
	},
	{
		id: ':PIManalyzer:IMD:ORDer 7',
		desc: 'Setting PIM7 Order',
		delay: '3'
	},
	{
		id: 'WAIT',
		desc: 'Please wait...',
		delay: '10'
	},
	{
		id: 'FAKE1',
		desc: 'FAKE1...',
		delay: '1'
	},
	{
		id: 'FAKE2',
		desc: 'FAKE2...',
		delay: '2'
	},
	{
		id: 'FAKE3',
		desc: 'FAKE3...',
		delay: '3'
	},
	{
		id: 'FAKE4',
		desc: 'FAKE4...',
		delay: '4'
	},
	{
		id: 'FAKE5',
		desc: 'FAKE5...',
		delay: '5'
	}
]