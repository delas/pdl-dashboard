import './AddNewHostFromServiceRegistryPopupList.scss';
import {useState, useEffect} from 'react';
import Dropdown from '../../../Widgets/Dropdown/Dropdown';
import SidebarHostItem from '../../../SidebarHosts/SidebarHostItem/SidebarHostItem';
import LoadingSpinner from '../../../Widgets/LoadingSpinner/LoadingSpinner';

function AddNewHostFromServiceRegistryPopupList(props) {

    const {
        title,
        DropdownOptions,
        onValueChange,
        selectedHostsList,
        onRemove,
        hostType,
        label,
    } = props;

    return (
        <div className='AddNewHostFromServiceRegistryPopupList-body'>
            <Dropdown
                options = {DropdownOptions}
                onValueChange = {onValueChange}
                label = {`${label}`}
                loading = {DropdownOptions === null}
            />
            <div className='AddNewHostFromServiceRegistryPopupList-body-bottom'>
                <span className='AddNewHostFromServiceRegistryPopupList-body-right-Title'>
                    {title}
                </span>
                <div className='AddNewHostFromServiceRegistryPopupList-body-right-list'>
                    {selectedHostsList.map((selectedHost, index) => {
                        return(
                            <SidebarHostItem key = {index}
                                id = {selectedHost.label}
                                hostName = {selectedHost.label}
                                hostType = {hostType}
                                addedFrom = {selectedHost.label}
                                onRemove = {onRemove}
                                ping = {null}
                                allowClick = {false}
                            />)
                    })}
                </div>
            </div>
        </div>
    );
}

export default AddNewHostFromServiceRegistryPopupList;
