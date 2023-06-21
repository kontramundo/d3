import "./style.css";

import * as d3 from "d3";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";

const treeData = {
    name: "Emplazamiento",
    value: 10,
    type: "green",
    level: "green",
    description: "2 días habiles\nObligatoria",
    children: [
        {
            name: "Notificacíon",
            value: 10,
            type: "blue",
            level: "blue",
            description: "5 días habiles\nObligatoria",
            children: [
                {
                    name: "Comparecencia",
                    value: 10,
                    type: "blue",
                    level: "blue",
                    description: "10 días habiles \n Opcional",
                    children: [
                        {
                            name: "Acuerdo de cierre de procedimiento",
                            value: 7.5,
                            type: "red",
                            level: "red",
                            description: "5 días habiles \n Opcional",
                        },
                        {
                            name: "Resolución",
                            value: 7.5,
                            type: "red",
                            level: "red",
                            description: "5 días habiles \n Opcional",
                        },
                    ],
                },
                {
                    name: "Acuerdo de trámite archivo provisional por huelga",
                    value: 10,
                    type: "blue",
                    level: "blue",
                    description: "10 días habiles \n Opcional",
                    children: [
                        {
                            name: "Resultado de notificación",
                            value: 7.5,
                            type: "blue",
                            level: "blue",
                            description: "5 días habiles \n Opcional",
                            children: [
                                {
                                    name: "Acuerdo de trámite archivo por huelga",
                                    value: 7.5,
                                    type: "red",
                                    level: "red",
                                    description: "5 días habiles \n Opcional",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "Acuerdo de trámite solicitando información al consignante",
                    value: 10,
                    type: "blue",
                    level: "blue",
                    description: "10 días habiles \n Opcional",
                    children: [
                        {
                            name: "Acuerdo de trámite se practique notificación",
                            value: 7.5,
                            type: "blue",
                            level: "blue",
                            description: "5 días habiles \n Opcional",
                            children: [
                                {
                                    name: "Acuerdo de archivo por falta de información",
                                    value: 7.5,
                                    type: "red",
                                    level: "red",
                                    description: "5 días habiles \n Opcional",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "Acuerdo de trámite solicitando información al particular",
                    value: 10,
                    type: "red",
                    level: "red",
                    description: "10 días habiles \n Opcional",
                },
                {
                    name: "Acuerdo de trámite solicitando acreditación de personalidad legal",
                    value: 10,
                    type: "red",
                    level: "red",
                    description: "10 días habiles \n Opcional",
                },
            ],
        },
    ],
};
// set the dimensions and margins of the diagram
const margin = { top: 150, right: 350, bottom: 120, left: 140 };
const width = window.innerWidth - margin.left - margin.right;
const height = window.innerHeight - margin.top - margin.bottom;

// declares a tree layout and assigns the size
const treemap = d3.tree().size([height, width]);

// assigns the data to a hierarchy using parent-child relationships
let nodes = d3.hierarchy(treeData, (d) => d.children);

// maps the node data to the tree layout
nodes = treemap(nodes);

// Append the SVG object to the body of the page
const svg = d3
    .select("#app")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
        }`
    )
    .attr("preserveAspectRatio", "xMidYMid meet");

const g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// adds the links between the nodes
const link = g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    //.style("stroke", (d) => d.data.level)
    .attr("d", (d) => {
        return (
            "M" +
            d.y +
            "," +
            d.x +
            "C" +
            (d.y + d.parent.y) / 2 +
            "," +
            d.x +
            " " +
            (d.y + d.parent.y) / 2 +
            "," +
            d.parent.x +
            " " +
            d.parent.y +
            "," +
            d.parent.x
        );
    });

// adds each node as a group
const node = g
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("g")
    .attr(
        "class",
        (d) => "node" + (d.children ? " node--internal" : " node--leaf")
    )
    .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")");

// adds the circle to the node
node.append("circle")
    .attr("r", (d) => d.data.value)
    .style("stroke", (d) => d.data.type)
    .style("fill", (d) => d.data.level)
    /*  .on("mouseover", function () {
        d3.select(this).style("cursor", "pointer");
        d3.select(this).style("stroke-width", "3px");
    })
    .on("mouseout", function () {
        d3.select(this).style("cursor", "default");
        d3.select(this).style("stroke-width", "1px");
    })
    .append("title")
    .text((d) => d.data.description); */
    .attr("data-bs-toggle", "tooltip")
    .attr("data-bs-placement", "top")
    .attr("data-bs-original-title", (d) => d.data.description);

// initialize tooltips
const tooltips = node.selectAll("circle").each(function () {
    new bootstrap.Tooltip(this);
});

// adds the text to the node
node.append("text")
    .attr("dy", ".35em")
    .attr("x", (d) => (d.children ? (d.data.value + 5) * -1 : d.data.value + 5))
    .style("text-anchor", (d) => (d.children ? "end" : "start"))
    .attr("transform", (d) => {
        // Determinar el ángulo de rotación del texto según la dirección de la línea
        const rotation = d.children ? -50 : -50;
        // Ajustar la posición vertical del texto según la dirección de la línea
        const yOffset = d.children ? -0 : 0;
        return `translate(${yOffset}, 0) rotate(${rotation})`;
    })
    .text((d) => d.data.name);
