define(['snap', 'tick-mark', 'number-utils'],
function(Snap,   tickMark,    NumberUtils) {
	return Snap.plugin(function(Snap, Element, Paper) {
		var PADDING = 10;
		var VERTICAL_TICK_PADDING = 10;

		var AXIS_LABEL_FONT_FAMILY = "'Lato', sans-serif";
		var AXIS_LABEL_FONT_WEIGHT = 400;
		var AXIS_LABEL_FONT_SIZE = 12;
		var AXIS_LABEL_PADDING = 5;

		Paper.prototype.axis = function(startX, startY, scale, tickMarkValues, tickMarkSize, orientation, label) {
			var paper = this;
			var axis = paper.g();

			var tickMarks = this.g();
			var totalValues = tickMarks.length;

			axis.startPoints = [];

			if (orientation === 'horizontal') {
				tickMarkValues.forEach(function(tickMark) {
					if (typeof(tickMark) !== 'object') {
						tickMark = {
							position: tickMark,
							label: NumberUtils.renderValue(tickMark)
						}
					}
					var pixel = scale.getPixel(tickMark.position);
					axis.startPoints.push({
						x: pixel,
						y: startY
					});
					tickMarks.append(
						paper.tickMark(
							pixel,
							startY,
							'vertical',
							tickMarkSize,
							tickMark.label,
							VERTICAL_TICK_PADDING
						)
					);
				});

				var axisLine = paper.line(startX, startY, scale.end, startY)
					.addClass('fm-axis');

				var axisLabel = paper.text(scale.middle, tickMarks.getBBox().y + tickMarks.getBBox().height + PADDING * 1.75, label)
				axisLabel.attr({
					'font-family': AXIS_LABEL_FONT_FAMILY,
					'font-weight': AXIS_LABEL_FONT_WEIGHT,
					'font-size': AXIS_LABEL_FONT_SIZE,
					'text-anchor': 'middle'
				});

				axis.append(axisLine);
				axis.append(axisLabel);
				axis.append(tickMarks);
			} else {
				tickMarkValues.forEach(function(tickMark) {
					if (typeof(tickMark) !== 'object') {
						tickMark = {
							position: tickMark,
							label: NumberUtils.renderValue(tickMark)
						}
					}
					
					var pixel = scale.getPixel(tickMark.position);
		
					axis.startPoints.push({
						x: startX,
						y: pixel
					});
					var newTickMark = paper.tickMark(
						startX,
						pixel,
						'horizontal',
						tickMarkSize,
						tickMark.label
					);
					tickMarks.append(newTickMark);
				});
				axis.append(tickMarks);

				var axisBBox = axis.getBBox();

				var axisLabel = paper.text(
					axisBBox.x - (AXIS_LABEL_FONT_SIZE / 2) - AXIS_LABEL_PADDING,
					scale.middle,
					label
				);

				var axisLabelBBox = axisLabel.getBBox();
				axisLabel.attr({
					'font-family': AXIS_LABEL_FONT_FAMILY,
					'font-weight': AXIS_LABEL_FONT_WEIGHT,
					'font-size': AXIS_LABEL_FONT_SIZE,
					'text-anchor': 'middle'
				})
					.transform('r -90');

				axis.append(axisLabel);
			}

			return axis;
		};
	});
});