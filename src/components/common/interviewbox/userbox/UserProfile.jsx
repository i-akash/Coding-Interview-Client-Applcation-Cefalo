import React, { Component } from 'react'
import { Segment, Label } from 'semantic-ui-react'

export default class UserProfile extends Component {
    render() {
        return (
            <Segment style={{ margin: '1rem' }}>
                <div><Label basic>Name :</Label>{sessionStorage.getItem("userName")}</div>
                <div><Label basic>Role :</Label>{sessionStorage.getItem('userRole')}</div>
                <div><Label basic>Room :</Label>{sessionStorage.getItem('userRoom')}</div>
            </Segment>
        )
    }
}
