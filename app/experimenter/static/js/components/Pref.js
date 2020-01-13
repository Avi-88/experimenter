import { boundClass } from "autobind-decorator";
import { Map } from "immutable";
import PropTypes from "prop-types";
import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import DesignInput from "experimenter/components/DesignInput";

import {
  PREF_KEY_HELP,
  PREF_TYPE_HELP,
  PREF_BRANCH_HELP,
} from "experimenter/components/constants";
import { PREF_VALUE_HELP } from "./constants";

@boundClass
class Pref extends React.PureComponent {
  static propTypes = {
    preference: PropTypes.instanceOf(Map),
    errors: PropTypes.instanceOf(Map),
    index: PropTypes.number,
    onChange: PropTypes.func,
    remove: PropTypes.func,
  };

  handlePrefValueChange(key, value) {
    const { onChange, preference } = this.props;
    onChange(preference.set(key, value));
  }

  renderTitle() {
    return <h4>Pref {this.props.index + 1}</h4>;
  }

  renderRemoveButton() {
    const { index } = this.props;
    if (index != 0) {
      return (
        <Button
          variant="outline-danger"
          onClick={() => {
            this.props.remove(index);
          }}
          id="remove-pref-branch-button"
        >
          <span className="fas fa-times" /> Remove Pref
        </Button>
      );
    }
  }

  renderPrefBranch() {
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <DesignInput
              label="Pref Branch"
              name="pref_branch"
              id="id_pref_branch"
              onChange={value => {
                this.handlePrefValueChange("pref_branch", value);
              }}
              value={
                this.props.preference
                  ? this.props.preference.get("pref_branch")
                  : null
              }
              error={this.props.errors.get("pref_branch", null)}
              as="select"
              helpContent={PREF_BRANCH_HELP}
              labelColumnWidth={3}
            >
              <option>Firefox Pref Branch</option>
              <option>default</option>
              <option>user</option>
            </DesignInput>
          </div>

          <div className="col-6">
            <DesignInput
              label="Pref Type"
              name="pref_type"
              id="id_pref_type"
              onChange={value => {
                this.handlePrefValueChange("pref_type", value);
              }}
              value={
                this.props.preference
                  ? this.props.preference.get("pref_type")
                  : null
              }
              error={this.props.errors.get("pref_type", null)}
              as="select"
              helpContent={PREF_TYPE_HELP}
              labelColumnWidth={3}
            >
              <option>Firefox Pref Type</option>
              <option>boolean</option>
              <option>integer</option>
              <option>string</option>
              <option>json string</option>
            </DesignInput>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <DesignInput
              label="Pref Name"
              name="pref_key"
              id="id_pref_key"
              onChange={value => {
                this.handlePrefValueChange("pref_name", value);
              }}
              value={
                this.props.preference
                  ? this.props.preference.get("pref_name")
                  : null
              }
              error={this.props.errors.get("pref_name", null)}
              helpContent={PREF_KEY_HELP}
              labelColumnWidth={3}
            />
          </div>

          <div className="col-6">
            <DesignInput
              label="Pref Value"
              name="pref_value"
              id="id_pref_value"
              onChange={value => {
                this.handlePrefValueChange("pref_value", value);
              }}
              value={
                this.props.preference
                  ? this.props.preference.get("pref_value")
                  : null
              }
              error={this.props.errors.get("pref_value", null)}
              helpContent={PREF_VALUE_HELP}
              labelColumnWidth={3}
            />
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div key={this.props.index} id="control-branch-group">
        <Row className="mb-3">
          <Col md={{ span: 5, offset: 1 }}>{this.renderTitle()}</Col>
          <Col md={6} className="text-right">
            {this.renderRemoveButton()}
          </Col>
        </Row>
        {this.renderPrefBranch()}
      </div>
    );
  }
}
export default Pref;
