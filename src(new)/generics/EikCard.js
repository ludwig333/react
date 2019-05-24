import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { connect } from "react-redux";
import {
  fetchGenerellInfo
} from "../modules/actions";

class EikCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { gotCredentials: false };
    this.url = this.getURLParameter("sak");
  }

  componentDidMount() {
    const dispatch = this.props.dispatch;
    dispatch(fetchGenerellInfo(this.url));
  }

  getURLParameter(name) {
    return (
      decodeURIComponent(
        (new RegExp("[?|&][s|S]ak=([^&;]+?)(&|#|;|$)").exec(
          decodeURIComponent(location.search)
        ) || [null, ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  }

    render () {

    const {
      generellInfo
    } = this.props;

        const cardHeaderStyle = {
            //backgroundColor : "#3d6099",
            backgroundColor: generellInfo.data.backgroundColor,
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

function mapStateToProps(state) {
  const {
    generellInfo
  } = state;

  return {
    generellInfo
  };
}

export default connect(mapStateToProps)(EikCard);