import React, { useCallback, useEffect, useRef, useState, useReducer } from "react";
import { Row, Button, Stack, Form, FormSelect, Card, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ArrowUpwardOutlined, ArrowDownwardOutlined, AddOutlined, DeleteOutlined, DoneOutlined, DeleteForeverOutlined, CloseOutlined } from '@mui/icons-material';
import { SketchPicker } from "react-color";
import { MoorhenMoleculeSelect } from "../select/MoorhenMoleculeSelect";
import { MoorhenChainSelect } from "../select/MoorhenChainSelect";
import { convertViewtoPx, getMultiColourRuleArgs } from "../../utils/MoorhenUtils";
import { MoorhenCidInputForm } from "../form/MoorhenCidInputForm";
import { MoorhenSequenceRangeSelect } from "../sequence-viewer/MoorhenSequenceRangeSelect";
import Draggable from "react-draggable";
import { IconButton } from "@mui/material";

const itemReducer = (oldList, change) => {
    if (change.action === 'Add') {
        return [...oldList, change.item]
    }
    else if (change.action === 'Remove') {
        return oldList.filter(item => item !== change.item)
    }
    else if (change.action === 'Empty') {
        return []
    }
    else if (change.action === 'Overwrite') {
        return [...change.items]
    }
    else if (change.action === 'MoveUp') {
        const itemIndex = oldList.findIndex(item => item === change.item)
        if (itemIndex === 0) {
            return oldList
        }
        let newList = oldList.slice()
        newList[itemIndex] = oldList[itemIndex - 1]
        newList[itemIndex - 1] = change.item
        return newList
    }
    else if (change.action === 'MoveDown') {
        const itemIndex = oldList.findIndex(item => item === change.item)
        if (itemIndex === oldList.length - 1) {
            return oldList
        }
        let newList = oldList.slice()
        newList[itemIndex] = oldList[itemIndex + 1]
        newList[itemIndex + 1] = change.item
        return newList
    }
}

const initialRuleState = []

export const MoorhenColourRules = (props) => {
    const moleculeSelectRef = useRef()
    const chainSelectRef = useRef()
    const ruleSelectRef = useRef()
    const residueRangeSelectRef = useRef()
    const cidFormRef = useRef()
    const [ruleType, setRuleType] = useState('molecule')
    const [colourProperty, setColourProperty] = useState('b-factor')
    const [selectedColour, setSelectedColour] = useState({r: 128, g: 128, b: 128, a: 0.5})
    const [selectedModel, setSelectedModel] = useState(null)
    const [selectedChain, setSelectedChain] = useState(null)
    const [cid, setCid] = useState(null)
    const [sequenceRangeSelect, setSequenceRangeSelect] = useState(null)
    const [ruleList, setRuleList] = useReducer(itemReducer, initialRuleState)
    const [opacity, setOpacity] = useState(0.5)
    const [toastBodyWidth, setToastBodyWidth] = useState(convertViewtoPx(40, props.windowWidth))

    const handleModelChange = (evt) => {
        setSelectedModel(parseInt(evt.target.value))
    }

    const handleChainChange = (evt) => {
        setSelectedChain(evt.target.value)
    }

    const handleResidueCidChange = (evt) => {
        setCid(evt.target.value)
    }

    const handleColorChange = (color) => {
        try {
            setSelectedColour(color.hex)
        }
        catch (err) {
            console.log('err', err)
        }
    }

    const getRules = async (imol, commandCentre) => {
        const selectedMolecule = props.molecules.find(molecule => molecule.molNo === imol)
        if (!selectedMolecule) {
            return 
        } else if (!selectedMolecule.colourRules) {
            await selectedMolecule.fetchCurrentColourRules()
        }
        return selectedMolecule.colourRules
    }

    const applyRules = useCallback(async () => {
        if (ruleList.length === 0) {
            return
        }
        const selectedMolecule = props.molecules.find(molecule => molecule.molNo === selectedModel)
        await selectedMolecule.setColourRules(props.glRef, ruleList, true)
    }, [selectedModel, ruleList, props.molecules, props.glRef])

    const createRule = () => {
        const selectedMolecule = props.molecules.find(molecule => molecule.molNo === selectedModel)
        if(!selectedMolecule) {
            return
        }

        let newRule
        if (ruleType !== 'property') {
            let cidLabel
            switch (ruleType) {
                case 'molecule':
                    cidLabel = "//*"
                    break
                case 'chain':
                    cidLabel = `//${chainSelectRef.current.value}`
                    break
                case 'cid':
                    cidLabel = cid
                    break
                case 'residue-range':
                    const selectedResidues = residueRangeSelectRef.current.getSelectedResidues()
                    cidLabel = (selectedResidues && selectedResidues.length === 2) ? `//${chainSelectRef.current.value}/${selectedResidues[0]}-${selectedResidues[1]}` : null
                    break
                default:
                    console.log('Unrecognised colour rule type...')
                    break
            }
            if (cidLabel) {
                newRule = {
                    commandInput: {
                        message:'coot_command',
                        command: 'add_colour_rule', 
                        returnType:'status',
                        commandArgs: [selectedModel, cidLabel, selectedColour]
                    },
                    isMultiColourRule: false,
                    ruleType: `${ruleType}`,
                    color: selectedColour,
                    label: cidLabel,
                }
            }
        } else {
            newRule = {
                commandInput: {
                    message:'coot_command',
                    command: 'add_colour_rules_multi', 
                    returnType:'status',
                    commandArgs: getMultiColourRuleArgs(selectedMolecule, ruleSelectRef.current.value)
                },
                isMultiColourRule: true,
                ruleType: `${ruleSelectRef.current.value}`,
                label: `${ruleSelectRef.current.value}`,
            }
        }

        if (newRule) {
            setRuleList({action: 'Add', item: newRule})    
        }
    }

    useEffect(() => {
        if (props.windowWidth > 1800) {
            setToastBodyWidth(convertViewtoPx(30, props.windowWidth))
        } else {
            setToastBodyWidth(convertViewtoPx(40, props.windowWidth))
        }
    }, [props.windowWidth])

    useEffect(() => {
        if (selectedModel !== null) {
            getRules(selectedModel, props.commandCentre).then(currentRules => {
                setRuleList({action: 'Overwrite', items: currentRules})
            })            
        } else {
            setRuleList({action: 'Empty'})
        }
    }, [selectedModel])

    useEffect(() => {
        if (props.molecules.length === 0) {
            setSelectedModel(null)
        } else if (selectedModel === null) {
            setSelectedModel(props.molecules[0].molNo)
        } else if (!props.molecules.map(molecule => molecule.molNo).includes(selectedModel)) {
            setSelectedModel(props.molecules[0].molNo)
        }
        
    }, [props.molecules.length])

    useEffect(() => {
        if (selectedModel === null || !ruleSelectRef.current || !chainSelectRef.current || ruleSelectRef.current?.value !== 'residue-range') {
            return
        }
        const selectedMolecule = props.molecules.find(molecule => molecule.molNo === selectedModel)
        const selectedSequence = selectedMolecule.sequences.find(sequence => sequence.chain === chainSelectRef.current.value)
        setSequenceRangeSelect(
            <MoorhenSequenceRangeSelect
                ref={residueRangeSelectRef}
                molecule={selectedMolecule}
                sequence={selectedSequence}
            />
        )        
    }, [selectedModel, selectedChain, ruleType])

    const getRuleCard = (rule, index) => {
        return <Card key={index} className='hide-scrolling' style={{margin: '0.1rem', maxWidth: '100%', overflowX:'scroll'}}>
                <Card.Body>
                    <Row className='align-items-center'>
                        <Col className='align-items-center' style={{ display: 'flex', justifyContent: 'left' }}>
                            {rule.label}
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'right', alignItems:'center' }}>
                            {!rule.isMultiColourRule ?
                                <div style={{borderColor: 'black', borderWidth:'5px', backgroundColor: rule.color, height:'20px', width:'20px', margin: '0.1rem'}}/>
                            : rule.ruleType === "b-factor" ?
                                <img className="colour-rule-icon" src={`${props.urlPrefix}/baby-gru/pixmaps/temperature.svg`} alt='b-factor' style={{height:'28px', width:'`12px', margin: '0.1rem'}}/>
                            :
                            <>
                                <div style={{borderColor: 'rgb(255, 125, 69)', borderWidth:'5px', backgroundColor:  'rgb(255, 125, 69)', height:'20px', width:'5px', margin: '0rem', padding: '0rem'}}/>
                                <div style={{borderColor: 'rgb(255, 219, 19)', borderWidth:'5px', backgroundColor: 'rgb(255, 219, 19)', height:'20px', width:'5px', margin: '0rem', padding: '0rem'}}/>
                                <div style={{borderColor: 'rgb(101, 203, 243)', borderWidth:'5px', backgroundColor: 'rgb(101, 203, 243)', height:'20px', width:'5px', margin: '0rem', padding: '0rem'}}/>
                                <div style={{borderColor: 'rgb(0, 83, 214)', borderWidth:'5px', backgroundColor: 'rgb(0, 83, 214)', height:'20px', width:'5px', margin: '0rem', padding: '0rem'}}/>
                            </>
                            }
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 400, hide: 400 }}
                                overlay={
                                    <Tooltip id="button-tooltip" {...props}>
                                        Move up
                                    </Tooltip>
                                }>
                                <Button size='sm' style={{margin: '0.1rem'}} variant={props.isDark ? "dark" : "light"} onClick={() => {setRuleList({action:'MoveUp', item:rule})}}>
                                    <ArrowUpwardOutlined/>
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 400, hide: 400 }}
                                overlay={
                                    <Tooltip id="button-tooltip" {...props}>
                                        Move down
                                    </Tooltip>
                                }>
                                <Button size='sm' style={{margin: '0.1rem'}} variant={props.isDark ? "dark" : "light"} onClick={() => {setRuleList({action:'MoveDown', item:rule})}}>
                                    <ArrowDownwardOutlined/>
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 400, hide: 400 }}
                                overlay={
                                    <Tooltip id="button-tooltip" {...props}>
                                        Delete
                                    </Tooltip>
                                }>
                                <Button size='sm' style={{margin: '0.1rem'}} variant={props.isDark ? "dark" : "light"} onClick={() => {setRuleList({action:'Remove', item:rule})}}>
                                    <DeleteOutlined/>
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
    }

    return <Draggable handle=".handle">
        <Card 
                bg='light'
                style={{position: 'absolute', top: '5rem', left: '5rem', opacity: opacity, width: toastBodyWidth, display: props.showColourRulesToast ? '' : 'none'}}
                onMouseOver={() => setOpacity(1)}
                onMouseOut={() => setOpacity(0.5)}
                >
            <Card.Header className="handle" style={{ justifyContent: 'space-between', display: 'flex', cursor: 'move', alignItems:'center'}}>
                Set molecule colour rules
                <IconButton style={{margin: '0.1rem', padding: '0.1rem'}} onClick={() => props.setShowColourRulesToast(false)}>
                    <CloseOutlined/>
                </IconButton>
            </Card.Header>
            <Card.Body style={{maxHeight: convertViewtoPx(60, props.height()), overflowY: 'scroll'}}>
                <Row>
                    <Stack gap={2} style={{alignItems: 'center'}}>
                        <Form.Group style={{ margin: '0.1rem', width: '100%' }}>
                            <Form.Label>Rule type</Form.Label>
                            <FormSelect size="sm" ref={ruleSelectRef} defaultValue={'molecule'} onChange={(val) => setRuleType(val.target.value)}>
                                <option value={'molecule'} key={'molecule'}>By molecule</option>
                                <option value={'chain'} key={'chain'}>By chain</option>
                                <option value={'residue-range'} key={'residue-range'}>By residue range</option>
                                <option value={'cid'} key={'cid'}>By CID</option>
                                <option value={'property'} key={'property'}>By property</option>
                            </FormSelect>
                        </Form.Group>
                            <Stack gap={2} style={{alignItems: 'center'}}>
                                <MoorhenMoleculeSelect width="100%" onChange={handleModelChange} molecules={props.molecules} ref={moleculeSelectRef}/>
                                {(ruleType === 'chain' || ruleType === 'residue-range')  && <MoorhenChainSelect width="100%" molecules={props.molecules} onChange={handleChainChange} selectedCoordMolNo={selectedModel} ref={chainSelectRef} allowedTypes={[1, 2]}/>}
                                {ruleType === 'cid' && 
                                    <MoorhenCidInputForm width="100%" onChange={handleResidueCidChange} ref={cidFormRef}/>
                                }
                                {ruleType === 'residue-range' && 
                                    <div style={{width: '100%'}}>
                                        {sequenceRangeSelect}
                                    </div>
                                }
                                {ruleType === 'property' && 
                                    <Form.Group style={{ margin: '0.1rem', width: '100%' }}>
                                        <Form.Label>Property</Form.Label>
                                        <FormSelect size="sm" ref={ruleSelectRef} defaultValue={'b-factor'} onChange={(val) => setColourProperty(val.target.value)}>
                                            <option value={'b-factor'} key={'b-factor'}>B-Factor</option>
                                            <option value={'af2-plddt'} key={'af2-plddt'}>AF2 PLDDT</option>
                                        </FormSelect>
                                    </Form.Group>
                                }
                                <Stack direction="horizontal" gap={2} style={{alignItems: 'center'}}>
                                    <div style={{display: ruleType === 'property' ? 'none' : ''}}>
                                        <SketchPicker color={selectedColour} onChange={handleColorChange} />
                                    </div>
                                    <Card style={{width:'100%', margin:'0rem'}}>
                                        <Card.Body className="hide-scrolling" style={{padding:'0.2rem', maxHeight: convertViewtoPx(25, props.windowHeight), overflowY: 'auto', textAlign:'center'}}>
                                            {ruleList.length === 0 ? 
                                                "No rules created yet"
                                            :
                                            ruleList.map((rule, index) => getRuleCard(rule, index))}
                                        </Card.Body>
                                    </Card>
                                <Stack gap={2} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 400, hide: 400 }}
                                        overlay={
                                            <Tooltip id="button-tooltip" {...props}>
                                                Add a rule
                                            </Tooltip>
                                        }>
                                        <Button variant={props.isDark ? "dark" : "light"} size='sm' onClick={createRule} style={{margin: '0.1rem'}}>
                                            <AddOutlined/>
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 400, hide: 400 }}
                                        overlay={
                                            <Tooltip id="button-tooltip" {...props}>
                                                Delete all rules
                                            </Tooltip>
                                        }>
                                        <Button variant={props.isDark ? "dark" : "light"} size='sm' onClick={() => {setRuleList({action:'Empty'})}} style={{margin: '0.1rem'}}>
                                            <DeleteForeverOutlined/>
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 400, hide: 400 }}
                                        overlay={
                                            <Tooltip id="button-tooltip" {...props}>
                                                Apply rules
                                            </Tooltip>
                                        }>
                                        <Button variant={props.isDark ? "dark" : "light"} size='sm' onClick={applyRules} style={{margin: '0.1rem'}}>
                                            <DoneOutlined/>
                                        </Button>
                                    </OverlayTrigger>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Row>
            </Card.Body>
        </Card>
    </Draggable> 
}
