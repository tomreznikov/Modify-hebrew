import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
declare var d3;

@Component({
  selector: 'app-resize-step',
  templateUrl: './resize-step.component.html',
  styleUrls: ['./resize-step.component.scss']
})
export class ResizeStepComponent implements OnInit {

  constructor(private mainServ: MainService) { }

  ngOnInit() {
    var width = +document.getElementById('my_dataviz').offsetWidth;
    var height = +document.getElementById('my_dataviz').offsetHeight;
    var newRadius;
    var allData = [];
    var data = [];

    allData = this.mainServ.items;

    data[0] = this.mainServ.items[this.mainServ.selectedNum - 1];
    this.mainServ.changeNum.subscribe(event => {
      data[0] = this.mainServ.items[event - 1];
      d3.select('svg').remove();
      this.init(width, height, newRadius, data);
    });

    this.init(width, height, newRadius, data);
  }

  init(width, height, newRadius, data) {
    let self = this;
    var colorScale = d3.scaleOrdinal(['#b1cbfa', '#deecfc', '#8e98f5', '#9aceff', '#86a6df', '#ffffff']);

    var box = d3.select('#my_dataviz')
      .append('svg')
      .attr('class', 'box')
      .attr('width', width)
      .attr('height', height);

    var resize = d3.drag()
      .on('drag', function (d) {
        d3.event.sourceEvent.stopPropagation();
        g.selectAll('.resizingContainer')
          .attr('r', function (c) {
            if (!c.radius) {
              c.radius = 50;
            }
            return Math.sqrt(Math.pow(+d3.event.sourceEvent.offsetX - (+this.attributes.cx.value), 2) + Math.pow(+d3.event.sourceEvent.offsetY - (+this.attributes.cy.value), 2)) + 6;
          });
        g.selectAll('.draggableCircle')
          .attr('r', function (c) {
            if (!c.radius) {
              c.radius = 50;
            }
            newRadius = Math.sqrt(Math.pow(+d3.event.sourceEvent.offsetX - (+this.attributes.cx.value), 2) + Math.pow(+d3.event.sourceEvent.offsetY - (+this.attributes.cy.value), 2));
            return newRadius;
          });
        // g.selectAll('text')
        //   .style('font-size', function (c) {
        //     if (!c.radius) {
        //       c.radius = 50;
        //     }
        //     let perc = ((newRadius - c.radius) / c.radius) * 100;
        //     return (c.radius < newRadius) ? 18 + (18 / 100 * perc) + 'px' : 18 + 'px';
        //   });
      })
      .on('end', function (d) {
        self.mainServ.items[self.mainServ.selectedNum - 1].radius = d3.select(this).attr('r');
      });

    var g = box.selectAll('.draggableCircle')
      .data(data)
      .enter()
      .append('g');

    g.append('circle')
      .attr('class', 'resizingContainer')
      .attr('id', 'resizingContainer0')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', function (d) {
        if (!d.radius) {
          d.radius = 50;
        }
        return +d.radius + 6;
      })
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .call(resize);

    g.append('circle')
      .attr('class', 'draggableCircle')
      .attr('id', 'draggableCircle0')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', function (d) {
        if (!d.radius) {
          d.radius = 50;
        }
        return +d.radius;
      })
      .style('fill', function(d, i ) {
        for (let index = 1; index < d.group; index++) {
          colorScale(index);
        }
        return colorScale(d.group);
      })
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    g.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', 18 + 'px')
      .style('cursor', 'pointer')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .text(data[0].name);

    function handleMouseOver(d, i) {  // Add interactivity
      document.getElementById('resizingContainer0').style.opacity = '1';
    }

    function handleMouseOut(d, i) {
      document.getElementById('resizingContainer0').style.opacity = '0';
    }
  }

}
