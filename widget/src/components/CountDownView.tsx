import * as React from 'react';

export interface ICountDownViewProps {
    date: Date
}

export interface ICountDownViewState {
    hours: number,
    min: number,
    sec: number
}

export default class CountDownView extends React.Component<ICountDownViewProps, ICountDownViewState> {

    private interval: number
    constructor(props: ICountDownViewProps) {
        super(props);

        this.state = {
            hours: 0,
            min: 0,
            sec: 0
        }
    }

    componentDidMount() {
        this.interval = window.setInterval(() => {

            this.calculateCountdown()
        }, 1000)
    }

    componentWillUnmount() {
        this.stop()
    }

    calculateCountdown = () => {
        let endDate = this.props.date
        let now = new Date()
        let diff = (endDate.getTime() - now.getTime()) / 1000

        if (diff <= 0) {
            this.stop()
            return;
        }


        const leftHours = Math.floor(diff / (60 * 60))

        diff = diff - leftHours * (60 * 60)

        const leftMin = Math.floor(diff / 60)


        diff = diff - leftMin * 60


        const leftSecond = Math.floor(diff)

        this.setState({
            hours: leftHours,
            min: leftMin,
            sec: leftSecond
        })
    }

    stop = () => {

        window.clearInterval(this.interval)
    }

    addLeadingZeros = (value: number): String => {
        let stringValue = String(value)
        while (stringValue.length < 2) {
            stringValue = '0' + stringValue
        }
        return stringValue
    }
    public render() {

        const { hours, min, sec } = this.state
        const hoursStr = this.addLeadingZeros(hours)
        const minStr = this.addLeadingZeros(min)
        const secStr = this.addLeadingZeros(sec)
        return (
            <div className="margin-a padding-tb05">
                <span className="count_down_item bce0 cfff fs13 tac">{hoursStr}</span>
                <span className="count_down_item_spector  c000 fs13 fb tac">:</span>
                <span className="count_down_item bce0 cfff fs13 tac">{minStr}</span>
                <span className="count_down_item_spector  c000 fs13 fb tac">:</span>
                <span className="count_down_item bce0 cfff fs13 tac">{secStr}</span>
            </div >
        );
    }
}
