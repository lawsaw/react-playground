import React, { Component } from 'react';
import classes from '../styles/Test.module.scss';

export default class extends Component {

    constructor(props) {
        super(props);
        this.mounted = true;
        this.timer = new Promise(resolve => {
            setTimeout(() => {
                resolve('resolve');
            }, 5000);
        });
    }

    async componentDidMount() {
        console.log('componentDidMount');
        let data = await this.timer;
        console.log(data);
        if(this.mounted) {
            console.log('mounted true');
            this.setState(() => ({
                data
            }))
        } else {
            console.log('mounted false');
        }

    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {

        return (
            <div className={classes.main2}>
                Test
            </div>
        )
    }
}
