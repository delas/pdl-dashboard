import './DotVisualizer.scss';
import {useState, useEffect} from 'react';
import { Graphviz } from 'graphviz-react';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';

/* 
    This visualizer is currently used primarily for visualizing the related resources of a file.
    However, it is possible to visualize all .dot files with this visualizer. To do so, simply 
    add the file extension to the config.js file in the getVisualizations() function.
*/

function DotVisualizer(props) {
    const {
        fileContent,
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, [fileContent]);

    const options = {
        fit: true,
        zoom: true,
        tooltip: true,
        height: "95%",
        width: "95%",
        aspectRatio: 1,
        boxSizing: "border-box",
        overflow: "hidden",
        "tooltip.class": "graphviz-tooltip",
        "tooltip.delay": 0,
        "tooltip.fade": false,
        "tooltip.fontcolor": "#000000",
        "tooltip.fontsize": "12px",
        "tooltip.fontfamily": "sans-serif",
        "tooltip.fontweight": "normal",
        "tooltip.color": "#ffffff",
        "tooltip.background-color": "#000000",
        "tooltip.border": "1px solid #000000",
        "tooltip.border-radius": "4px",
        "tooltip.opacity": 0.8,
        "tooltip.offset": 10,
        "tooltip.arrow": true,
        "tooltip.arrow.color": "#000000",
        "tooltip.arrow.size": 10,
        "tooltip.multiline": true,
        "tooltip.adjust": true,
        "tooltip.adjust.x": 0,
        "tooltip.adjust.y": 0,
        "tooltip.adjust.scale": 1,
        "tooltip.adjust.rotate": 0,
        "tooltip.adjust.flip": "none",
        "tooltip.adjust.scroll": true,
        "tooltip.adjust.resize": true,
        "tooltip.adjust.resize.width": 0,
        "tooltip.adjust.resize.height": 0,
        "tooltip.adjust.resize.keep": "none",
        "tooltip.adjust.resize.maxwidth": 0,
        "tooltip.adjust.resize.maxheight": 0,
        "tooltip.adjust.resize.minwidth": 0,
        "tooltip.adjust.resize.minheight": 0,
        "tooltip.adjust.resize.scale": 1,
        "tooltip.adjust.resize.rotate": 0,
        "tooltip.adjust.resize.flip": "none",
        "tooltip.adjust.resize.scroll": true,
    }
    
    if(isLoading || !fileContent){
        return (
            <div className="DotVisualizer-loading">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    const getAllNodes = () => {   
        document.getElementsByClassName("node");
    }

    return (
        <div className="DotVisualizer" onClick = {() => {getAllNodes()}}>
            <Graphviz dot={fileContent} className="DotVisualizer-graphviz"
                options={options}
            />
        </div>
    )
}

export default DotVisualizer;
