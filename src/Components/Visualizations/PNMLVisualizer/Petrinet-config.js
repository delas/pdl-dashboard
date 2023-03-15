import * as React from 'react';

export const EdgeId = "edge";
export const PlaceId = "place";
export const TransitionId = "transition";
export const NODE_KEY = "id";

const edgeShape = (
    <symbol viewBox="0 0 0 0" id={`${EdgeId}`} key="0">
        <circle cx="15" cy="15" r="8" fill="currentColor"/>
    </symbol>
)

const placeShape = (
    <symbol viewBox="0 0 50 50" id={`${PlaceId}`}key="0">
        <circle cx="25" cy="25" r="15"/>
    </symbol>
)

const transitionShape = (
    <symbol viewBox="0 0 150 50" id={`${TransitionId}`} key="0">
        <rect x="0" y="0" rx="10" ry="10" width="150" height="50"/>
    </symbol>
)


const config = {
    EdgeTypes: {
        edge: {
            shape: edgeShape,
            shapeId: `#${EdgeId}`,
        }
    },

    NodeTypes: {
        place: {
            shape: placeShape,
            shapeId: `#${PlaceId}`,
            // typeText: 'None',
        },
        transition: {
            shape: transitionShape,
            shapeId: `#${TransitionId}`,
            // typeText: 'None',
        },
    },
};

export default config;
