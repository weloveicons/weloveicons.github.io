var App = React.createClass({
    getInitialState: function() {
        return { 
            size: 10,
            stroke: 50,
            corner: 20
         };
    },
    handleValueChange: function(name, value) {
            console.log(name, value);
            var obj = {};
            obj[name] = value;
            this.setState(obj);
    },
    render: function() {
        return (
            <div className="app">
                <Preview { ...this.state } />
                <Toolbar { ...this.state } valueChanged={ this.handleValueChange } />
            </div>
        );
    }
});

var icon = {
    name: 'image',
    viewBox: [0, 0, 45, 35],
    elements: [
        { element: 'rect', x: 3, y: 2, width: 39, height: 30 },
        { element: 'circle', cx: 31.5, cy: 9.5, r: 2.5 },
        { element: 'polyline', points: [ 3,29, 16,15, 25.5,25.5, 32.5,18.75, 42,28.5 ] }
    ]
}

var Icon = React.createClass({
    renderElement: function(element) {
        var props = {
            'strokeWidth': this.props.stroke,
            'stroke': 'blue',
            opacity: '0.5'
        };
        switch(element.element) {
            case 'rect':
                return (<rect {...element} {...props} rx={this.props.corner} ry={this.props.corner}/>);
            case 'circle':
                return (<circle {...element} {...props} />);
            case 'polyline':
                var pointStr = element.points.reduce(function(prev, curr, i) {
                    return prev + (i % 2 == 0 ? ',' : ' ') + curr;
                });
                return (<polyline points={ pointStr } {...props} />);
            default:
                return (<rect x="0" y="0" width="10" height="10" opacity="0.2" fill="red"/>);
        }
    },
    render: function() {
        var elements = this.props.icon.elements.map(this.renderElement);
        return (
            <svg viewBox={ this.props.icon.viewBox }>
                { elements }
            </svg>
        );
    }
});

var Preview = React.createClass({
    render: function() {
        return (
            <div className="preview">
                <Icon icon={ icon } { ...this.props } />
            </div>
        );
    }
});

var Toolbar = React.createClass({
    render: function() {
        return (
            <div className="toolbar">
                <Slider name="size" value={ this.props.size } valueChanged = { this.props.valueChanged } />
                <Slider name="stroke" value={ this.props.stroke } valueChanged = { this.props.valueChanged } />
                <Slider name="corner" value={ this.props.corner } valueChanged = { this.props.valueChanged } />
            </div>
        );
    }
});

var Slider = React.createClass({
    handleChange: function(event) {
        this.props.valueChanged(this.props.name, event.target.value);
    },
    render: function() {
        return (
            <div>
            <label>
                { this.props.name }
                <input type="range" value={ this.props.value } className="topcoat-range" onChange={ this.handleChange } />
                <input type="text" value={ this.props.value } className="topcoat-text-input" onChange={ this.handleChange } />
            </label>
            </div>
        );
    }
});

React.render(
    <App />
,
document.body
);
