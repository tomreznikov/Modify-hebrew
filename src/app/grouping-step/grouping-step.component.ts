import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import * as moment from 'moment';

declare var d3;

@Component({
  selector: 'app-grouping-step',
  templateUrl: './grouping-step.component.html',
  styleUrls: ['./grouping-step.component.scss']
})
export class GroupingStepComponent implements OnInit {

  constructor(private mainServ: MainService) { }

  transform = {
    k: 1,
    x: 0,
    y: 0
  };

  ngOnInit() {
    var width = +document.getElementById('my_dataviz_group').offsetWidth;
    var height = +document.getElementById('my_dataviz_group').offsetHeight;
    var newRadius;
    var data = this.mainServ.items;

    this.init(width, height, newRadius, data);

    this.mainServ.saveSVG.subscribe(event => {

      if (event) {
        var svg = document.getElementById('my_dataviz_group');
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg);

        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
        var a = document.createElement('a');
        a.href = url;
        a.download = `${this.mainServ.fullName}_${moment().format('MM/DD/YYYY')}.svg`;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);

        let data = this.mainServ.items.map(element => {
          let temp = Object.assign({}, element);
          delete temp.index;
          delete temp.vy;
          delete temp.vx;
          delete temp.fx;
          delete temp.fy;
          return temp;
        });
        var csvContent = this.arrayToCSV({data: data, columnDelimiter: ';'});
        var universalBOM = '\uFEFF';
        var encodedUri = 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM + csvContent);

        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${this.mainServ.fullName}_${moment().format('MM/DD/YYYY')}.csv`);
        document.body.appendChild(link);

        link.click();
      }
    });
  }

  init(width, height, newRadius, data) {
    let self = this;
    var colorScale = d3.scaleOrdinal(['#b1cbfa', '#deecfc', '#8e98f5', '#9aceff', '#86a6df', '#ffffff']);

    var svg = d3.select('#my_dataviz_group')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // svg.call(d3.zoom()
    //   .extent([[0, 0], [width, height]])
    //   .scaleExtent([0.1, 2])
    //   .on('zoom', function () {
    //     transform = d3.event.transform;
    //     g.attr('transform', d3.event.transform);
    //   }));

    var zoom = d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([-8 / 2, 4])
      .on('zoom', zoomed);
    svg.call(zoom);

    function zoomed() {
      self.transform = d3.event.transform;
      g.attr('transform', d3.event.transform);
    }

    var node2 = svg.selectAll('.resizingContainer')
      .data(data)
      .enter()
      .append('g')
      .append('circle')
      .attr('class', 'resizingContainer')
      .attr('id', function (d, i) {
        return 'resizingContainer' + i;
      })
      .attr('r', function (d) {
        if (!d.radius) {
          d.radius = 50;
        }
        return +d.radius + 6;
      })
      .attr('cx', function(d) { return d.x ? d.x : width / 2; })
      .attr('cy', function(d) { return d.y ? d.y : height / 2; })
      .style('opacity', '0')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .call(d3.drag()
        .on('start', function (d) {
          dragstarted(d);
        })
        .on('drag', function (d, i) {
          d3.event.sourceEvent.stopPropagation();
          svg.select('#resizingContainer' + i)
            .attr('r', function (c) {
              if (!c.radius) {
                c.radius = 50;
              }
              return Math.sqrt(Math.pow((+d3.event.sourceEvent.offsetX - self.transform.x) / self.transform.k - (+this.attributes.cx.value), 2) + Math.pow((+d3.event.sourceEvent.offsetY - self.transform.y) / self.transform.k - (+this.attributes.cy.value), 2)) + 6;
            });
          svg.select('#draggableCircle' + i)
            .attr('r', function (c) {
              if (!c.radius) {
                c.radius = 50;
              }
              newRadius = Math.sqrt(Math.pow((+d3.event.sourceEvent.offsetX - self.transform.x) / self.transform.k - (+this.attributes.cx.value), 2) + Math.pow((+d3.event.sourceEvent.offsetY - self.transform.y) / self.transform.k - (+this.attributes.cy.value), 2));
              return newRadius;
            });
          // svg.select('#draggableText' + i)
          //   .style("font-size", function (c) {
          //     if (!c.radius) {
          //       c.radius = 50;
          //     }
          //     let perc = ((newRadius - c.radius) / c.radius) * 100;
          //     return (c.radius < newRadius) ? 18 + (18 / 100 * perc) + "px" : 18 + "px";
          //   });
        })
        .on('end', function (d) {
          d.radius = +d3.select(this).attr('r');
          dragended(d);
        }));

    var node = svg.selectAll('.draggableCircle')
      .data(data)
      .enter()
      .append('g')
      .append('circle')
      .attr('class', 'draggableCircle')
      .attr('id', function (d, i) {
        return 'draggableCircle' + i;
      })
      .attr('r', function (d) {
        if (!d.radius) {
          d.radius = 50;
        }
        return +d.radius;
      })
      .attr('cx', function(d) { return d.x ? d.x : width / 2; })
      .attr('cy', function(d) { return d.y ? d.y : height / 2; })
      .style('fill', function(d, i ) { return colorScale(d.group); })
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    var node3 = svg.selectAll('.draggableText')
      .data(data)
      .enter()
      .append('g')
      .append('text')
      .attr('id', function (d, i) {
        return 'draggableText' + i;
      })
      .attr('x', function(d) { return d.x ? d.x : width / 2; })
      .attr('y', function(d) { return d.y ? d.y : height / 2; })
      .attr('text-anchor', 'middle')
      .style('font-size', 18 + 'px')
      .style('cursor', 'pointer')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .text(function (d) {
        return d.name;
      });

    var g = svg.selectAll('g');

     var simulation = d3.forceSimulation()
        .force("forceX", d3.forceX().strength(.09).x(width * .5))
        .force("forceY", d3.forceY().strength(.09).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-60));

    initSimulation(true);

    function handleMouseOver(d, i) {  // Add interactivity
      document.getElementById('resizingContainer' + i).style.opacity = '1';
    }

    function handleMouseOut(d, i) {
      document.getElementById('resizingContainer' + i).style.opacity = '0';
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
      initSimulation();
    }


    function initSimulation(queue?) {
      simulation
        .nodes(data)
        .force('collide', d3.forceCollide().strength(.5).radius(function (d) {
          if (!d.radius) {
            d.radius = 50;
          }
          return +d.radius + 10;
        }).iterations(1))
        .on('tick', function (d) {
          node
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; });
          node2
            .attr('cx', function (d, i) {
              return d.x;
            })
            .attr('cy', function (d, i) {
              if (i === (data.length - 1) && queue) {
                if (simulation.alpha() > 0.04 ) {
                  var xExtent = d3.extent(node2.data(), function (d) { return d.x; });
                  var yExtent = d3.extent(node2.data(), function (d) { return d.y; });
                  var xScale = width / (xExtent[1] - xExtent[0] + (d.radius * 2 + 12)) * 0.75;
                  var yScale = height / (yExtent[1] - yExtent[0] + (d.radius * 2 + 12)) * 0.75;
                  var minScale = Math.min(xScale, yScale);

                  if (minScale < 1) {
                    self.transform = d3.zoomIdentity.translate(width / 2, height / 2)
                      .scale(minScale)
                      .translate(-(xExtent[0] + xExtent[1]) / 2, -(yExtent[0] + yExtent[1]) / 2);
                    svg.call(zoom.transform, self.transform);
                  }
                } else {
                  svg.call(zoom);
                }
              }
              return d.y;
            });
          node3
            .attr('x', function (d) { return d.x; })
            .attr('y', function (d) { return d.y; });
        });
    }
  }

  arrayToCSV({ data = null, columnDelimiter = ',', lineDelimiter = '\n' }) {
    let result, ctr, keys

    if (data === null || !data.length) {
      return null;
    }

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(item => {
      ctr = 0;
      keys.forEach(key => {
        if (ctr > 0) {
          result += columnDelimiter;
        }

        result += typeof item[key] === 'string' && item[key].includes(columnDelimiter) ? `"${item[key]}"` : item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

}
