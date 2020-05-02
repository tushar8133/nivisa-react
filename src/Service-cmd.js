export const cmdNames = [
{
	id: '*IDN?',
	desc: 'Getting device name',
	delay: '2'
},
{
	id: 'INSTrument:CATalog:FULL?',
	desc: 'Checking all modes',
	delay: '0.5'
},
{
	id: 'INSTrument:NSELect 46',
	desc: 'Setting PIM Analyzer mode',
	delay: '35'
},
{
	id: 'INSTrument:NSELect?',
	desc: 'Checking current mode',
	delay: '3'
},
{
	id: 'PIManalyzer:MODe PIM',
	desc: 'Setting PIM vs Time Measurement',
	delay: '2'
},
{
	id: 'PIManalyzer:MODe SPECTRUM_VIEW',
	desc: 'Setting Noise Floor',
	delay: '2'
},
{
	id: 'PIManalyzer:MODe DTP',
	desc: 'Setting Distance to PIM',
	delay: '2'
},
{
	id: 'PIManalyzer:MODe PIMSwp',
	desc: 'Setting Swept PIM',
	delay: '2'
},
{
	id: 'CALibration:PIManalyzer:FULL ON',
	desc: 'Starting  Calibration',
	delay: '8'
},
{
	id: 'CALibration:PIManalyzer:FULL?',
	desc: 'Checking Calibration',
	delay: '8'
},
{
	id: 'PIManalyzer:OUTPut:POWer ',
	desc: 'Setting Power',
	delay: '0.5'
},
{
	id: 'PIManalyzer:TEST:DURation ',
	desc: 'Setting Duration',
	delay: '0.5'
},
{
	id: 'INITiate:PIManalyzer:MEASure ON',
	desc: 'Start Measurement',
	delay: '0.5'
},
{
	id: 'PIManalyzer:MEASure:VALue?',
	desc: 'Check Measured Values',
	delay: '4'
},
{
	id: 'PIManalyzer:FREQuency:F1?',
	desc: 'Getting Frequency Tone 1',
	delay: '3'
},
{
	id: 'PIManalyzer:FREQuency:F2?',
	desc: 'Getting Frequency Tone 2',
	delay: '3'
},
{
	id: 'PIManalyzer:IMD:ORDer 3',
	desc: 'Setting PIM3 Order',
	delay: '3'
},
{
	id: 'PIManalyzer:IMD:ORDer 5',
	desc: 'Setting PIM5 Order',
	delay: '3'
},
{
	id: 'PIManalyzer:IMD:ORDer 7',
	desc: 'Setting PIM7 Order',
	delay: '3'
}
]