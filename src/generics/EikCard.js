import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

export default class EikCard extends React.Component {

    render () {

        const cardHeaderStyle = {
            backgroundColor : "#3d6099",
            padding : "8px"
        }

        const style = {
            marginBottom: "20px",
        }

        const cardText = {
            padding: "0px"
        }

        const cardActions = () => {
            if (this.props.actions === undefined) return null;
            return (
                <CardActions
                  style={{paddingBottom: "10px"}}
                >
                    {this.props.actions}
                </CardActions>
            );
        }

        return (
            <Card
                onExpandChange={this.props.onExpandChange}
                style={style}
                containerStyle={{paddingBottom : "0px"}}
                initiallyExpanded={this.props.expanded === undefined ? true : this.props.expanded}
            >
                <CardHeader
                  showExpandableButton={true}
                  title={this.props.title}
                  subtitle={this.props.subtitle}
                  subtitleColor="#c6c4c4"
                  subtitleStyle={{fontSize : "9pt"}}
                  titleStyle={{fontSize : "10pt", color : "white", fontWeight : "bolder"}}
                  style={cardHeaderStyle}
                  actAsExpander={true}
                />
                {cardActions()}
                <CardText style={cardText} expandable={true}>
                    {this.props.children}
                </CardText>
            </Card>
        )
    }
}
