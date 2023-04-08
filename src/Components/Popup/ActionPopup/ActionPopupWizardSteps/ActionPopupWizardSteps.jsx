import './ActionPopupWizardSteps.scss';

function ActionPopupWizardSteps(props) {

    const {
        wizardStep = 1,
        maxWizardStep = 4,
        handleWizardStepsClick = () => {},
    } = props;

    return (
        <div className='ActionPopup-wizard-steps'>
            <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${wizardStep === 1 ? "selected": ""}
                ActionPopup-wizard-step-${maxWizardStep >= 1 ? "clickable": "non-clickable"}
            `} onClick = {() => {handleWizardStepsClick(1)}}>
                <span className='ActionPopup-wizard-step-text'>1. Miner</span>
            </div>
            <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${wizardStep === 2 ? "selected": ""}
                ActionPopup-wizard-step-${maxWizardStep >= 2 ? "clickable": "non-clickable"}
            `} onClick = {() => {handleWizardStepsClick(2)}}>
                <span className='ActionPopup-wizard-step-text'>2. Inputs</span>
            </div>
            <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${wizardStep === 3 ? "selected": ""}
                ActionPopup-wizard-step-${maxWizardStep >= 3 ? "clickable": "non-clickable"}
            `} onClick = {() => {handleWizardStepsClick(3)}}>
                <span className='ActionPopup-wizard-step-text'>3. Parameters</span>
            </div>
            <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${wizardStep === 4 ? "selected": ""}
                ActionPopup-wizard-step-${maxWizardStep >= 4 ? "clickable": "non-clickable"}
            `} onClick = {() => {handleWizardStepsClick(4)}}>
                <span className='ActionPopup-wizard-step-text'>4. Repository</span>
            </div>
        </div>
    );
}

export default ActionPopupWizardSteps;
