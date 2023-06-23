import "./style.css";

import * as d3 from "d3";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";

const treeData = {
    name: "Emplazamiento",
    value: 10,
    type: "green",
    level: "green",
    description: "2 días habiles </br> Obligatoria",
    children: [
        {
            name: "Notificacíon",
            value: 10,
            type: "blue",
            level: "blue",
            description: "5 días habiles Obligatoria",
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
const margin = { top: 0, right: 150, bottom: 0, left: 50 };
const width = window.innerWidth - margin.left - margin.right;
const height = window.innerHeight - margin.top - margin.bottom;

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

// declares a tree layout and assigns the size
const treemap = d3.tree().size([height, width]);

// assigns the data to a hierarchy using parent-child relationships
const nodes = d3.hierarchy(treeData, (d) => d.children);

// maps the node data to the tree layout
const tree = treemap(nodes);

// adds the links between the nodes
const link = g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", (d) => {
        const separation = 100; // Separación horizontal entre los nodos
        const dx = d.x - d.parent.x; // Diferencia vertical entre los nodos
        const dy = d.y - d.parent.y; // Diferencia horizontal entre los nodos
        const dr = Math.sqrt(dx * dx + dy * dy); // Distancia entre los nodos

        // Ajusta la posición horizontal del punto de control para aumentar la separación
        const controlPointX = (separation * dy) / dr;

        return `
      M ${d.y},${d.x}
      C ${(d.y + d.parent.y) / 2 + controlPointX},${d.x}
        ${(d.y + d.parent.y) / 2 + controlPointX},${d.parent.x}
        ${d.parent.y},${d.parent.x}
    `;
    });

// adds each node as a group
const node = g
    .selectAll(".node")
    .data(tree.descendants())
    .enter()
    .append("g")
    .attr(
        "class",
        (d) => "node" + (d.children ? " node--internal" : " node--leaf")
    )
    .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")");

const scale = d3
    .scaleLinear()
    .domain([0, 0]) // Rango de valores de movimiento (puedes ajustarlo según tus necesidades)
    .range([10, 20]); // Rango de tamaños del círculo (puedes ajustarlo según tus necesidades)

// adds the circle to the node
node.append("circle")
    .attr("r", 10)
    .style("fill", (d) => d.data.level)
    .attr("data-bs-toggle", "tooltip")
    .attr("data-bs-placement", "top")
    .attr("data-bs-original-title", (d) => d.data.name)
    .attr("data-bs-toggle", "modal")
    .attr("data-bs-target", "#modalD3")
    .attr("role", "button")
    .on("click", showModal)
    .on("mousemove", function (event) {
        // Obtiene el movimiento actual y ajusta el tamaño del círculo
        const movement = d3.pointer(event)[0]; // Puedes ajustar esto según el eje que desees utilizar (x o y)
        const scaledRadius = Math.max(scale(movement), 0); // Asegura que el radio no sea negativo
        d3.select(this).attr("r", scaledRadius);
    })
    .on("mouseout", function () {
        // Restaura el tamaño inicial del círculo al salir del área
        d3.select(this).attr("r", 10);
    });

// initialize tooltips
const tooltips = node.selectAll("circle").each(function () {
    new bootstrap.Tooltip(this);
});

// Agregar el texto utilizando "foreignObject" para permitir múltiples líneas
node.append("foreignObject")
    .attr("x", (d) => (d.children ? -8 : 8))
    .attr("y", 8) // Ajusta el posicionamiento vertical según tus necesidades
    .attr("width", 250) // Ancho máximo de cada línea (ajusta según tus necesidades)
    .attr("height", 200) // Altura del contenedor de texto (ajusta según tus necesidades)
    .style("text-anchor", (d) => (d.children ? "end" : "start"))
    .html((d) => {
        const lines = d.data.name.split("\n");
        return lines
            .map((line) => `<div class="link-responsive">${line}</div>`)
            .join("");
    });

function showModal() {
    // Obtén los datos relacionados con el nodo
    const nodeData = d3.select(this).datum().data;

    // Actualiza el contenido del modal con los datos del nodo
    const modalTitle = document.querySelector("#modalD3 .modal-title");
    const modalBody = document.querySelector("#modalD3 .modal-body");

    modalTitle.innerHTML = nodeData.name;
    modalBody.innerHTML = nodeData.description;
}
