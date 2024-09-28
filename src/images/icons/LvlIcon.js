import React from "react";

const LevelIcon = ({ level }) => {
    return (
        <svg
            width='53'
            height='54'
            viewBox='0 0 53 54'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <circle
                cx='26'
                cy='28'
                r='25.5'
                fill='url(#paint0_linear_16_846)'
                stroke='#ADADB0'
            />
            <path
                d='M51.5044 28C51.5044 24.5432 50.815 21.1211 49.4767 17.9338C48.1384 14.7466 46.1779 11.8583 43.71 9.43776C41.242 7.01724 38.3162 5.11317 35.1036 3.83691C31.891 2.56065 28.4562 1.93783 25 2.00489'
                stroke='currentColor'
                stroke-width='2.5'
            />

            <text
                x='50%'
                y='54%'
                dominantBaseline='middle'
                textAnchor='middle'
                fontSize='10'
                fill='currentColor'
                className='font-Inter text-13.5 font-semibold text-center text-primary'
            >
                lvl {level}
            </text>
            <defs>
                <linearGradient
                    id='paint0_linear_16_846'
                    x1='26'
                    y1='2'
                    x2='-101.5'
                    y2='77.5'
                    gradientUnits='userSpaceOnUse'
                ></linearGradient>
            </defs>
        </svg>
    );
};

export default LevelIcon;
