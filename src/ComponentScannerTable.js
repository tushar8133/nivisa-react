import React from 'react';
import XLSX from 'xlsx';

export class ScannerTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            operatorName: ''
        };
        this.clearDataConfirmation = 0;
    }

    checkBackupData() {
        let local = JSON.parse(localStorage.getItem("table"));
        try {
            if(local[0]['qrcode']) {
                this.setState({ tableData: local });    
            }
        } catch(e) {}
    }

    static getDerivedStateFromProps(props, state) {
        if(props.addon && props.addon.qrcode) {
            return {
                tableData: ScannerTable.checkDuplicate(state.tableData, props.addon)
            }
        }
        return null;
    }

    componentDidMount() {
        this.checkBackupData();
    }

    componentDidUpdate() {
        localStorage.setItem('table', JSON.stringify(this.state.tableData));
    }

    clearData() {
        this.clearDataConfirmation++;
        let buttonText = document.getElementById("clearData");
        if(this.clearDataConfirmation >= 2) {
            this.props.that.setState({
                newData: {}
            })
            this.setState({
                tableData: []
            })
            buttonText.innerText = "Clear Data";
            this.clearDataConfirmation = 0;
        } else {
            buttonText.innerText = "Are you sure!";
            setTimeout( _ => {
                buttonText.innerText = "Clear Data";
                this.clearDataConfirmation = 0;
            }, 2000);
        }
    }

    render() {
        return (
            <main id="ScannerTable" align="center">
                <div>
                    <table id="data-table" border="1">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Serial No.</th>
                                <th>Power</th>
                                <th>Duration</th>
                                <th>dBm</th>
                                <th>dBc</th>
                                <th>Time</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                             {this.state.tableData.map((row, index) => <tr key={row.qrcode}><td>{this.state.tableData.length - index}</td><td>{row.qrcode}</td><td>{row.power}</td><td>{row.duration}</td><td className={this.checkDBMValue(row.dBm)}>{row.dBm} dBm</td><td className={this.checkDBCValue(row.dBc)}>{row.dBc} dBc</td><td>{row.timestamp}</td><td><button onClick={_ => this.deleteRow(index)}>&#10005;</button></td></tr>)}
                        </tbody>
                    </table>
                </div>
                <input type="text" id="operatorName" placeholder="Enter Operator Name" onInput={ _ => this.saveOperatorName(_.target.value.trim()) } onFocus={ _ => this.operatorFocus()  } onBlur={ _ => this.operatorBlur()  }/>
                <button onClick={_ => this.exportData()} disabled={!this.state.operatorName}>Save Excel</button>&nbsp;
                <button id="clearData" onClick={_ => this.clearData()}>Clear Data</button>
            </main>);
    }

    operatorFocus() {
        this.props.that.stopCursor();
    }

    operatorBlur() {
        this.props.that.cursorTimer1 = null;
        this.props.that.resetCursor();
    }

    saveOperatorName(name) {
        this.setState({
            operatorName: name
        })
    }

    checkDBMValue(val) {
        var local = Number(localStorage.getItem("dbcutoff"));
        if(local) {
            return (val <= local)? "pass" : "fail";
        } else {
            return "";
        }
    }

    checkDBCValue(val) {
        var local = Number(localStorage.getItem("dbcutoff"));
        if(local) {
            return (val <= (local - 20))? "pass" : "fail";
        } else {
            return "";
        }
    }

    deleteRow(index) {
        var duplicateState = [...this.state.tableData];
        duplicateState.splice(index, 1);
        this.setState({
            tableData: duplicateState
        })

        this.props.that.setState({
            newData: {}
        })
    }

    static checkDuplicate(oldData, newData) {
        var unique = oldData.filter((val, index) => {
            return (val.qrcode !== newData.qrcode);
        });
        unique.unshift(newData)
        return unique;
    }

    formatDate(type) {
        var dt = new Date();
        if(type === 'print') return (`${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`);
        if(type === 'save') return (`${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} (${dt.getHours().toString().padStart(2, '0')}${dt.getMinutes().toString().padStart(2, '0')})`);
    }

    exportData() {
        // console.table(this.state.tableData);
        var data = [...this.state.tableData].reverse();
        var newData = data.map((obj, index) => {
            return Object.assign({ index: String(index + 1) }, obj)
        })
        // console.table(newData);
        this.xlsxModule(this.state.operatorName, newData);
    }

    xlsxModule(person, data) {
        var ws = XLSX.utils.json_to_sheet([{ A: 'Operator Name', B: person }, { A: 'Date', B: this.formatDate('print') }], { header: ['A', 'B'], skipHeader: true });
        XLSX.utils.sheet_add_json(ws, data, { skipHeader: false, origin: 'A4' });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(wb, `Anritsu Test -- ${person} -- ${this.formatDate('save')}.xlsx`);
    }
}