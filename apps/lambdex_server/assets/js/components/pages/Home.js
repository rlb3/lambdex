import React, {Component} from 'react';
import LambdaListItem from "./Home/LambdaListItem";
import Box from "react-bulma-components/lib/components/box";
import Section from "react-bulma-components/lib/components/section";
import Columns from "react-bulma-components/lib/components/columns";
import Heading from "react-bulma-components/lib/components/heading";
import client from "../../services/apiClient";
import PageLoader from "../common/PageLoader";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {data: null};

    client.get("/api/lambdas").then((ret) => {
      this.setState({data: ret.data.data});
    });
  }

  editClicked(lambda) {
    window.location = `/edit/${lambda.id}`;
  };
  
  deleteClicked(lambda) {
    if (confirm("Are you sure you want to delete?")) {
      client.delete(`/api/lambdas/${lambda.id}`).then((ret) => {
        console.log(ret);
        window.location = "/";
      });
    }
  };

  detailsClicked(lambda) {
    window.location = `/details/${lambda.id}`;
  };

  renderHeader() {
    return <Box className="lambda-list-header">
    <Columns>
      <Columns.Column>
        <Heading size={4}>Lambda</Heading>
      </Columns.Column>
      <Columns.Column>
        <Heading size={4}># of runs</Heading>
      </Columns.Column>
      <Columns.Column>
        <Heading size={4}>Timing</Heading>
      </Columns.Column>
      <Columns.Column>
      </Columns.Column>
    </Columns>
    </Box>
  }

  render() {
    if (this.state.data == null) {
      return <PageLoader/>
    }
    return <Section>
      {this.renderHeader()}
      {this.state.data.map((lambda, i) => <LambdaListItem key={i} lambda={lambda}
                                                          onItemDetails={this.detailsClicked.bind(this, lambda)}
                                                          onItemEdit={this.editClicked.bind(this, lambda)}
                                                          onItemDelete={this.deleteClicked.bind(this, lambda)}/>)}
    </Section>
  }
}


export default Home