import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllArmor, saveArmor } from '../../ducks/reducer.js';
import './AllArmor.css';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Save from 'material-ui/svg-icons/content/save';

class AllArmor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            armorList: this.props.allArmor,
            category: '',
            class: '',
            selectedArmor: []
        }
        this.saveArmor = this.saveArmor.bind(this);
        this.filteredArmor = this.filteredArmor.bind(this);
    }

    componentDidMount() {
        this.props.getAllArmor();
    }

    componentWillReceiveProps(newProps) {
        this.setState({ armorList: newProps.allArmor });
    }

    saveArmor() {
        if (!this.props.characterArmor.find((e) => e.id === this.state.armorList[this.state.selectedArmor[0]].id)) {
            this.props.saveArmor({character_id: this.props.character.id, armor_id: this.state.armorList[this.state.selectedArmor[0]].id});
        }
        this.setState({ armorList: this.props.allArmor, category: '', class: '', selectedArmor: [] });
    }

    filteredArmor(value) {
        let filteredList = this.props.allArmor.filter((armor, index) => {
            return armor.category.includes(value) || armor.classes.includes(value);
        });
        this.setState({ armorList: filteredList });
    }

    render() {
        return (
            <div className='AllArmor'>
                <div className='armor_filters'>
                    <h4>Filter Armor: </h4>
                    <SelectField
                        floatingLabelText='Category'
                        value={this.state.category}
                        onChange={(event, index, value) => {
                            this.setState({ category: value });
                            this.filteredArmor(value)
                        }}
                        style={{ width: '170px', textAlign: 'left' }}
                    >
                        <MenuItem value={'Light'} primaryText='Light Armor' />
                        <MenuItem value={'Medium'} primaryText='Medium Armor' />
                        <MenuItem value={'Heavy'} primaryText='Heavy Armor' />
                        <MenuItem value={'Shield'} primaryText='Shield' />
                    </SelectField>
                    <SelectField
                        floatingLabelText='Class'
                        value={this.state.class}
                        onChange={(event, index, value) => {
                            this.setState({ class: value });
                            this.filteredArmor(value);
                        }}
                        style={{ width: '140px', textAlign: 'left' }}
                    >
                        <MenuItem value={'Barbarian'} primaryText='Barbarian' />
                        <MenuItem value={'Bard'} primaryText='Bard' />
                        <MenuItem value={'Cleric'} primaryText='Cleric' />
                        <MenuItem value={'Druid'} primaryText='Druid' />
                        <MenuItem value={'Fighter'} primaryText='Fighter' />
                        <MenuItem value={'Monk'} primaryText='Monk' />
                        <MenuItem value={'Paladin'} primaryText='Paladin' />
                        <MenuItem value={'Ranger'} primaryText='Ranger' />
                        <MenuItem value={'Sorcerer'} primaryText='Sorcerer' />
                        <MenuItem value={'Warlock'} primaryText='Warlock' />
                        <MenuItem value={'Wizard'} primaryText='Wizard' />
                    </SelectField>
                    <RaisedButton
                        label='Reset Filter'
                        primary={true}
                        onClick={() => this.setState({ armorList: this.props.allArmor, category: '', class: '' })}
                    />
                </div>
                <div className='armor_table'>
                    <Table 
                        style={{ tableLayout: 'auto', zIndex: 1 }}
                        onRowSelection={(selectedRows) => this.setState({ selectedArmor: selectedRows })}
                    >
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={true}
                        >
                            <TableRow>
                                <TableHeaderColumn tooltip='Category'>CATERGORY</TableHeaderColumn>
                                <TableHeaderColumn tooltip='Name'>NAME</TableHeaderColumn>
                                <TableHeaderColumn tooltip='Cost'>COST</TableHeaderColumn>
                                <TableHeaderColumn tooltip='Armor Class'>AC</TableHeaderColumn>
                                <TableHeaderColumn tooltip='Strength'>STRENGTH</TableHeaderColumn>
                                <TableHeaderColumn tooltip='Stealth'>STEALTH</TableHeaderColumn>
                                <TableHeaderColumn tooltip='Weight'>WEIGHT</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={true}
                            showRowHover={true}
                            stripedRows={false}
                        >
                            {this.state.armorList.map((armor, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn>{armor.category}</TableRowColumn>
                                    <TableRowColumn>{armor.name}</TableRowColumn>
                                    <TableRowColumn>{armor.cost}</TableRowColumn>
                                    <TableRowColumn>{armor.ac}</TableRowColumn>
                                    <TableRowColumn>{armor.strength}</TableRowColumn>
                                    <TableRowColumn>{armor.stealth}</TableRowColumn>
                                    <TableRowColumn>{armor.weight}</TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {this.props.character.id ?
                        <FloatingActionButton
                            className='save'
                            label='Add Armor'
                            children={<Save />}
                            onClick={() => {
                                this.saveArmor();
                                this.props.switch();
                            }}
                        />
                    : null}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        allArmor: state.allArmor,
        character: state.character,
        characterArmor: state.characterArmor
    };
}

export default connect(mapStateToProps, { getAllArmor, saveArmor })(AllArmor);
