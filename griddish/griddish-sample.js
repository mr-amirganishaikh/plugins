// GRID Library
$.prototype.griddish = function(gridOptions) {
	var localgridOptions = {
		"griddishRow" : ".griddishRow",
		"griddishRowTemplate" : ".griddishRowTemplate",
		"griddeshPagesContainer" : ".griddeshPages",
		"griddishRows" : ".griddishRows",
		"rowIdPrefix":"griddishRow_",
		"showOnEdit" : ".onEdit",
		"showOnView" : ".onView",
		"showOnDelete" : ".ifDeleted",
		"showOnUnDelete" : ".ifDeletable",
		"editBtn" : ".editBtn",
		"saveBtn" : ".saveBtn",
		"deleteBtn":".deleteBtn",
		"undeleteBtn":".undeleteBtn",
		"cancelEditBtn" : ".cancelEditBtn",
		"addNewBtn":undefined,
		"saveGridBtn":undefined,
		"editable" : true,
		"sortable" : false,
		"cloneValues" : true,
		"inputCommaFormat":true,
		"inputCommaFormatClass":"griddishNumInput",
		"formatNumber":true,
		"formatShort":false,
		"formatNumberClass":"griddishNum",
		"formatNumberDivision":config.amountDivision||1000000,
		"formatNumberFraction":config.roundFraction||2,
		"formatNumberAppend":config.amountSymbol||"M",
		"resettable":true,
		"deletable":true,
		"undeletable":true,
		"initDeleteBtn":true,
		"confirmBeforeDelete":true,
		"removeRowOnDelete":true,
		"onDeleteClass":'griddishDeleted',
		"onEditClass":'griddishEditing',
		"onSaveClass":"griddishSaved",
		"onEmptyClass":"griddishEmpty",
		"onUndeleteClass":'',
		"cloneTargetPrefix" : '.view',
		"checkBoxViewRender" : function(elem) {

			if ($(elem).prop('checked')) {
				if ($(elem).attr('data-text-on')) {
					return $(elem).attr('data-text-on');
				} else {
					return "On";
				}
			} else {
				if ($(elem).attr('data-text-off')) {
					return $(elem).attr('data-text-off');
				} else {
					return "Off";
				}
			}
		},
		"onChange" : function(grid) {
		},
		"onInit" : function(grid) {
		},
		"onAdd" : function(row) {
		},
		"onEdit" : function(row) {
		},
		"onReset" : function(row) {
		},
		"onSave" : function(row) {
		},
		"beforeSave" : function(row) {
			return true;
		},
		"onGridSave" : function(grid) {
		},
		"beforeGridSave" : function(grid) {
			return true;
		},
		"onDelete" : function(row) {
		},
		"onUnDelete" : function(row) {
		},
		"beforeDelete" : function (row,elem){
			return true;
		},
		"onPaginate" : function(grid,perPage){
		    return true;
		},
		"paginated" : false,
		"perPage" : config.tablePageSize,
		"offset" : '0',
		"sortBy" : '0',
		"sortDir" : 'desc',
		//Implement this function to be called on pages loading
		"dataGrabAndFill" : function (grid){
			return true;
		},
		//For any parameters to be handled by the library
		"extraParams" : {}
		
	};
	this.gridOptions = $.extend(localgridOptions, gridOptions);
	
	this.resetPagination = function (){
		this.gridOptions.offset = 0;
	}
	
	this.draw = function(){
		this.gridOptions.dataGrabAndFill(this);
		return true;
	}
	
	this.sort = function(sortBy, sortDir){
		this.gridOptions.sortBy = sortBy || '0';
		this.gridOptions.sortDir = sortDir || 'desc';
		this.draw();
	}
	
	this.callPage = function (pageNumber){
		this.gridOptions.offset = (parseInt(pageNumber) - 1) * parseInt(this.gridOptions.perPage);
		return this.draw();
	}

	this.currentPage = function(){
		return parseInt(this.gridOptions.offset) / parseInt(this.gridOptions.perPage) + 1;
	}

	this.nextPage = function(){
		return parseInt(this.currentPage() + 1);
	}

	this.previousPage = function(){
		return parseInt(this.currentPage() - 1);
	}
	
	this.paginate = function(grid, perPage, sortBy, sortDir){
		
		this.enableSorting(grid, sortBy, sortDir)
		
		this.gridOptions.onPaginate(grid);
		if (typeof(perPage) != "undefined")
			 grid.gridOptions.perPage = perPage;
		$("body").on("click",".paginate_button", function(){$(this).goToPage(grid,$(this).attr("data-dt-idx"));});
		this.reload();	
	}
	
	this.resetSortingIndicators = function(){
		$(this).find("th:not(.no-sort)").removeClass("sorting sorting_desc sorting_asc").addClass("sorting");	
    }

	this.enableSorting = function(grid, sortBy, sortDir){
		
		var sortBy = (typeof(sortBy) != "undefined")? sortBy: this.gridOptions.sortBy;
		var sortDir = (typeof(sortDir) != "undefined")? sortDir: this.gridOptions.sortDir;
		
		var directionClass = (sortDir == 'asc')?'sorting_asc':'sorting_desc';
		grid.resetSortingIndicators();
		var sortableColumn = grid.find("th:not(.no-sort)").get(sortBy);
		$(sortableColumn).removeClass("sorting sorting_desc sorting_asc").addClass(directionClass);
		
		
		$(this).find("th:not(.no-sort)").on("click", function(){
			var newClass = "sorting_desc";
			if ($(this).hasClass("sorting_desc")) newClass = "sorting_asc";
			if ($(this).hasClass("sorting_asc")) newClass = "sorting_desc";
			grid.resetSortingIndicators();
			$(this).removeClass("sorting sorting_desc sorting_asc").addClass(newClass);
			grid.sort(grid.find("th."+newClass+":not(.no-sort)").index(),newClass.split("_").pop());
		})
	}
	
	
	
	this.drawPagination = function(totalRecords){
		
		var pagesAvailable = (totalRecords > this.gridOptions.perPage)?true:false;
		if (pagesAvailable){
			var pagesCount = Math.ceil(totalRecords / this.gridOptions.perPage) - 1;
		}
		this.find(this.gridOptions.griddeshPagesContainer).empty();
		
		if (pagesAvailable && (this.currentPage()>1))
			this.find(this.gridOptions.griddeshPagesContainer).append('<a class="paginate_button previous disabled" aria-controls="spv-datatable" data-dt-idx="'+this.previousPage()+'" tabindex="0" id="spv-datatable_previous">Previous</a>');
		if (pagesAvailable){
			
			var drawPageLink = function(pageNumber, currentPage){
				
				var currentClass = (currentPage == pageNumber)? 'current':'';
				return '<a class="paginate_button '+currentClass+'" aria-controls="spv-datatable" data-dt-idx="'+pageNumber+'" tabindex="'+pageNumber+'">'+pageNumber+'</a>';
			}
			this.find(this.gridOptions.griddeshPagesContainer).append(drawPageLink(1, this.currentPage()));
			for (var i = 1; i <= pagesCount; i++) {
				var incrementedI = i+1;
				this.find(this.gridOptions.griddeshPagesContainer).append(drawPageLink(incrementedI,this.currentPage()));
			}
		}

        if (pagesAvailable)
        	this.find(this.gridOptions.griddeshPagesContainer).append('</span>');
        
        if (pagesAvailable && (this.currentPage() <= pagesCount))
        	this.find(this.gridOptions.griddeshPagesContainer).append('<a class="paginate_button next" aria-controls="spv-datatable" data-dt-idx="'+this.nextPage()+'" tabindex="'+this.nextPage()+'" id="spv-datatable_next">Next</a>');
    
        
	}
	
	this.newRow = function() {		
		var rowTemplateContainer = $(this.gridOptions.griddishRowTemplate, this);
		var newRow = $(this.gridOptions.griddishRow, rowTemplateContainer).clone();			
		return newRow;
	}

	this.setRowId = function(row,id){
		if(id==undefined || id==null || id=='null' || id=="")
			return false;
		row.attr("id",this.prepareId(id));
	}

	this.getRowId = function(row){
		return $(row).attr("id");
	}
	
	this.prepareId = function(id){
		return this.gridOptions.rowIdPrefix+id;
	}
	
	this.getRow	= function(id){		
		return $(this.gridOptions.griddishRow+this.prepareId(id)+':first',$(this.gridOptions.griddishRows,this));
	}
	
	this.addRow = function(row) {
		$(this.gridOptions.griddishRows, this).append(row);
		if (this.gridOptions.editable) {
			this.makeEditable(row);
		}
		
		if (this.gridOptions.deletable && this.gridOptions.initDeleteBtn) {
			this.makeDeletable(row);
		}
		if (this.gridOptions.undeletable) {
			this.makeUndeletable(row);
		}
		
		if(this.gridOptions.inputCommaFormat){
			this.inputCommaFormat(row);
		}
		this.gridOptions.onAdd(row);
		this.gridOptions.onChange(this);
		this.cloneValues(row);
	}
	
	this.addEmptyRow = function(){
		var newRow = this.newRow();
		newRow.addClass(this.gridOptions.onEmptyClass);	
		this.addRow(newRow);
		if(this.gridOptions.editable){
			this.editRow(newRow);
		}		
	}
	
	this.isEmpty = function(row){				
		if(row.hasClass(this.gridOptions.onEmptyClass)){
			return true;
		}else{
			return false
		}		
	}
	
	this.editRow = function(row) {
		$(this.gridOptions.showOnView, row).hide();
		$(this.gridOptions.showOnEdit, row).fadeIn();
		
		row.removeClass(this.gridOptions.onSaveClass);	
		row.addClass(this.gridOptions.onEditClass);
		
		if(this.gridOptions.inputCommaFormat){
			this.inputCommaFormatTrigger(row);
		}
		
		this.gridOptions.onEdit(row);
	}
	
	this.isEditing = function(row){
		if(row.hasClass(this.gridOptions.onEditClass)){
			return true;
		}else{
			return false;
		}
	}
	
	this.cancelEditRow = function(row){
		
		if(row.hasClass(this.gridOptions.onEditClass)){
			this.cleanFormatting(row);
			$(this.gridOptions.showOnEdit, row).hide();
			$(this.gridOptions.showOnView, row).fadeIn();
			row.addClass(this.gridOptions.onSaveClass).removeClass(this.gridOptions.onEditClass).removeClass(this.gridOptions.onEmptyClass);
			
			this.resetToDefault(row);			
			this.gridOptions.onReset(row);
			this.gridOptions.onChange(this);
			this.cloneValues(row);
		}
		return true;
	}

	this.saveRow = function(row) {
		this.cleanFormatting(row);
		if(this.gridOptions.beforeSave(row)){
			$(this.gridOptions.showOnEdit, row).hide();
			$(this.gridOptions.showOnView, row).fadeIn();
			row.addClass(this.gridOptions.onSaveClass).removeClass(this.gridOptions.onEditClass).removeClass(this.gridOptions.onEmptyClass);	
			
			this.gridOptions.onSave(row);
			this.gridOptions.onChange(this);
			this.cloneValues(row);
		}else{
			console.warn("Griddish: Save row aborted as beforeSave returned false");
			return false;
		}
		
	}
	
	this.isSaved = function(row){				
		if(row.hasClass(this.gridOptions.onSaveClass)){
			return true;
		}else{
			return false
		}
		
	}
	
	this.saveGrid = function(){
		if(this.gridOptions.beforeGridSave(this)){
			this.gridOptions.onGridSave(this);
		}else{
			console.warn("Griddish: Save row aborted as beforeGridSave returned false");
			return false;
		}
		
	}

	this.deleteRow = function(row) {
		var instance = this;
		row.removeClass(this.gridOptions.onUndeleteClass);
		row.addClass(this.gridOptions.onDeleteClass);	
		
		$(this.gridOptions.showOnUnDelete, row).hide();
		$(this.gridOptions.showOnEdit, row).hide();
		
		$(this.gridOptions.showOnView, row).fadeIn();
		$(this.gridOptions.showOnDelete, row).fadeIn();		
		
		if(this.gridOptions.removeRowOnDelete){
			row.fadeOut(function(){
				this.remove();
				instance.gridOptions.onDelete(row);
				instance.gridOptions.onChange(instance);
			});
		}else{
			this.gridOptions.onDelete(row);
			this.gridOptions.onChange(this);
		}
		
		
	}
	
	this.deleteParentRow = function(elem){
		this.deleteRow($(elem).closest(this.gridOptions.griddishRow));		
	}
	
	this.isDeleted = function(row){
		if(row.hasClass(this.gridOptions.onDeleteClass)){
			return true;
		}else{
			return false
		}
	};
	this.undeleteRow = function(row){
		
		row.removeClass(this.gridOptions.onDeleteClass);
		row.addClass(this.gridOptions.onUndeleteClass);
		$(this.gridOptions.showOnDelete, row).hide();
		$(this.gridOptions.showOnUnDelete, row).fadeIn();
		
		this.gridOptions.onUnDelete(row);
		this.gridOptions.onChange(this);
	}
	
	this.inputCommaFormat = function(row){
		$('.'+this.gridOptions.inputCommaFormatClass,row).keyup(function(event) {		  
			  if(event.which >= 37 && event.which <= 40) return;		 
			  $(this).val(function(index, value) {
			    return value
			    .replace(/[^0-9.-]/g, "")
			    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			    ;
			  });
			});
		
	}
	
	this.inputCommaFormatTrigger = function(row){
		$('.'+this.gridOptions.inputCommaFormatClass,row).keyup();
		
	}
	
	this.cleanFormatting = function(selector){
		if(this.gridOptions.inputCommaFormat){
			var rows = $(selector,$(this.gridOptions.griddishRows,this));
			var instance = this;
			$("."+this.gridOptions.inputCommaFormatClass,rows).each(function(){							
				$(this).val(instance.cleanNumber($(this).val()));
			})
		}
	}
	
	this.lock = function() {
		
		$(this.gridOptions.editBtn, this).unbind('click').hide();
		$(this.gridOptions.cancelEditBtn, this).unbind('click').hide();
		$(this.gridOptions.saveBtn, this).unbind('click').hide();
		$(this.gridOptions.deleteBtn, this).unbind('click').hide();
		$(this.gridOptions.undeleteBtn, this).unbind('click').hide();
	}
	
	this.unlock = function() {
		var instance = this;
		var rows = this.getAllRows();
		$.each(rows,function(i,row){
			instance.makeRowDynamic(row);
		});
		
	}

	this.makeRowStatic = function(row) {
		
		$(this.gridOptions.editBtn, row).unbind('click').hide();
		$(this.gridOptions.cancelEditBtn, row).unbind('click').hide();
		$(this.gridOptions.saveBtn, row).unbind('click').hide();
		$(this.gridOptions.deleteBtn, row).unbind('click').hide();
		$(this.gridOptions.undeleteBtn, row).unbind('click').hide();
	}
	
	this.makeRowDynamic = function(row) {		
		
		if (this.gridOptions.editable) {
			this.makeEditable(row);
		}
		
		if (this.gridOptions.deletable && this.gridOptions.initDeleteBtn) {
			this.makeDeletable(row);
		}
		if (this.gridOptions.undeletable) {
			this.makeUndeletable(row);
		}		
	}
	
	this.makeEditable = function(row) {
		var instance = this;
		$(this.gridOptions.editBtn, row).click(function(elem) {
			instance.editRow(row);
		});
		$(this.gridOptions.saveBtn, row).click(function(elem) {
			instance.saveRow(row);
		});
		
		if(this.isEditing(row)){
			$(this.gridOptions.editBtn, row).hide();
			$(this.gridOptions.saveBtn, row).show();
		}else{
			$(this.gridOptions.editBtn, row).show();
			$(this.gridOptions.saveBtn, row).hide();
		}
		
		
		if(this.gridOptions.resettable){
			$(this.gridOptions.cancelEditBtn, row).click(function(elem) {
				instance.cancelEditRow(row);
			});
			
			if(this.isEditing(row)){
				$(this.gridOptions.cancelEditBtn, row).show();
			}else{
				$(this.gridOptions.cancelEditBtn, row).hide();
			}
			
		}

	}
	
	this.makeDeletable = function(row) {
		var instance = this;
			$(this.gridOptions.deleteBtn, row).click(function(e) {
				if(instance.gridOptions.confirmBeforeDelete){
					if(instance.gridOptions.beforeDelete(row,this) == true){
						instance.deleteRow(row);
					}
				}else{
					instance.deleteRow(row);
				}
				
			}).show();
				

	}
	
	this.makeUndeletable = function(row) {
		var instance = this;
		$(this.gridOptions.undeleteBtn, row).click(function(elem) {			
			instance.undeleteRow(row);
		});
		if(this.isDeleted(row)){
			$(this.gridOptions.undeleteBtn, row).show();
		}else{
			$(this.gridOptions.undeleteBtn, row).hide();
		}
	}
	
	
	this.getAllRows = function(){
		var selector = this.gridOptions.griddishRow+':not(.'+this.gridOptions.onDeleteClass+')';		
		this.cleanFormatting(selector);
		return $(selector,$(this.gridOptions.griddishRows,this));
	}
	this.getAllRowsIncludingDeleted = function(){		
		var selector = this.gridOptions.griddishRow
		this.cleanFormatting(selector);
		return $(selector,$(this.gridOptions.griddishRows,this));
	}
	this.getSavedRows = function(){
		var selector = this.gridOptions.griddishRow+this.gridOptions.onSaveClass;
		this.cleanFormatting(selector);
		return $(selector,$(this.gridOptions.griddishRows,this));
	}
	this.getDeletedRows = function(){
		var selector = this.gridOptions.griddishRow+this.gridOptions.onDeleteClass;
		this.cleanFormatting(selector);
		return $(selector,$(this.gridOptions.griddishRows,this));
	}
	this.getActiveRows = function(){
		//$('.a:not(.b,.c)')
		var selector = this.gridOptions.griddishRow+':not(.'+this.gridOptions.onDeleteClass+',.'+this.gridOptions.onEmptyClass+')';
		this.cleanFormatting(selector);
		return $(selector,$(this.gridOptions.griddishRows,this));
	}
	
	this.reset = function(){
		$(this.gridOptions.griddishRow,$(this.gridOptions.griddishRows,this)).remove();
		this.gridOptions.onChange(this);
		this.resetPagination();
	}
	
	this.reload = function(){
		$(this.gridOptions.griddishRow,$(this.gridOptions.griddishRows,this)).remove();
		this.gridOptions.onInit(this);
	}
	
	//additional methods customized
	
	this.getFullTotal = function(inputName,inputType){
		var total = 0;
		var val = 0;
		var type = (typeof(inputType) == "undefined")?"input":inputType;
		instance = this;
		
		
		var list = (type == "input")?$('input[name="'+inputName+'"]',$(this.gridOptions.griddishRows,instance)):$('.'+inputName,$(this.gridOptions.griddishRows,instance));
		
		list.each(function(){
			val = (type == "input")?instance.cleanNumber($(this).val()):instance.cleanNumber($(this).html());
			if(instance.isNumber(val)){
				total+=parseFloat(val);
			}
		});
		return total;
	}
	
	this.getActiveTotal = function(inputName){
		var instance = this;
		var total = 0;
		var val = 0;
		var rows = instance.getActiveRows();
		
		if(rows.length == 0)
			return 0;
		
		$.each(rows,function(i,row){
			$('input[name="'+inputName+'"]',row).each(function(){
				val = instance.cleanNumber($(this).val());
				if(instance.isNumber(val)){
					total+=parseFloat(val);
				}
			});
		});		
		return total;		
	}
	
	this.getStaticTotal = function(inputSelect){
		var instance = this;
		var total = 0;
		var val = 0;
		var rows = instance.getActiveRows();
		
		if(rows.length == 0)
			return 0;
		
		$.each(rows,function(i,row){
			$(inputSelect,row).each(function(){
				val = instance.cleanNumber($(this).html());
				if(instance.isNumber(val)){
					total+=parseFloat(val);
				}
			});
		});		
		return total;		
	}
	
	
	this.cloneValues = function(row) {
		
		if (!this.gridOptions.cloneValues) {
			return;
		}
		var instance = this;
		var val = 0;
		$(row).find("input[type='text']").each(
				function() {
					if ($(this).attr("name") != undefined) {
						val = $(this).val();
						$(this).attr('data-griddefault',val);
						$(instance.gridOptions.cloneTargetPrefix
										+ $(this).attr("name"), row).html(
												val);
					}
				});

		$(row).find('textarea').each(
				function() {
					if ($(this).attr("name") != undefined) {
						val = $(this).html();
						$(this).attr('data-griddefault',val);
						$(instance.gridOptions.cloneTargetPrefix
										+ $(this).attr("name"), row).html(
								$(this).val());
					}
				});

		$(row).find('select').each(
				function() {
					if ($(this).attr("name") != undefined && ($("option:selected", this).val() != '' && $("option:selected", this).val() != 'null' && $("option:selected", this).val() != null ) ) {
						
						val = $("option:selected", this).val();
						$(this).attr('data-griddefault',val);
						
						$(instance.gridOptions.cloneTargetPrefix
										+ $(this).attr("name"), row).html(
								$("option:selected", this).text());
					}
				});

		$(row).find("input[type='checkbox']").each(
				function() {
					if ($(this).attr("name") != undefined) {
						var prop = $(this).prop('checked');
						if (prop == "checked" || prop == "true" || prop == true) {
							$(this).attr('data-griddefault',"checked");
						}else{
							$(this).attr('data-griddefault',"false");						
						}
						
						var displayHtml = instance.gridOptions
								.checkBoxViewRender(this);
						$(instance.gridOptions.cloneTargetPrefix
										+ $(this).attr("name"), row).html(
								displayHtml);
					}
				});
		if(instance.gridOptions.formatNumber){
			$("."+ instance.gridOptions.formatNumberClass,row).each(function(){
				val = $(this).html();
				val = instance.formatNumber(val);
				$(this).html(val);
			});			
		}
	
	}
	
	this.resetToDefault = function(row) {
		
		if(!this.gridOptions.resettable){
			return false;
		}
		var instance = this;
		var val = 0;
		$(row).find("input[type='text']").each(
				function() {
					if ($(this).attr('data-griddefault') != undefined) {
						$(this).val($(this).attr('data-griddefault'));	
					}
				});
		
		
		$(row).find('textarea').each(
				function() {
					if ($(this).attr('data-griddefault') != undefined) {
						$(this).html($(this).attr('data-griddefault'));	
					}
				});

		$(row).find('select').each(
				function() {
					if ($(this).attr("name") != undefined && ($("option:selected", this).val() != '' && $("option:selected", this).val() != 'null' && $("option:selected", this).val() != null ) ) {
						
						if ($(this).attr('data-griddefault') != undefined) {
							$(this).val($(this).attr('data-griddefault'));	
						}
					}
				});

		$(row).find("input[type='checkbox']").each(
				function() {	
					var defaultVal = $(this).attr('data-griddefault')
					
					if(defaultVal == "true" || defaultVal == true || defaultVal == "checked" ){
						$(this).prop('checked','checked');
					}else{
						$(this).removeAttr("checked");
					}
					
					
				});
		return true;
	}
	//helper
	
	this.isNumber = function (n) { n = n.replace (/,/g, ""); return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }
	this.cleanNumber = function(n){return n.replace(/[^0-9.-]/g, "")} //;
	this.formatNumber = function(num){				
			  if(!this.isNumber(num)){
				  return num;
			  }			  
			  if(num == undefined || num == 0) return "0";
			  
			  if(this.gridOptions.formatShort){
				  numLocale = parseFloat(parseFloat(num) / parseFloat(this.gridOptions.formatNumberDivision)).toFixed(parseFloat(this.gridOptions.formatRoundFraction));		  
				  numLocale = numLocale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");			  
				  return numLocale + " " + this.gridOptions.formatNumberAppend;
			  }else{
				  numLocale = parseFloat(num);
				  numLocale = numLocale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				  return numLocale;
			  }		
	}
	var instance = this;
	if(this.gridOptions.addNewBtn != undefined){		
		$(this.gridOptions.addNewBtn,instance).click(function(){
			instance.addEmptyRow();
		}) 
	} 
	
	if(this.gridOptions.saveGridBtn != undefined){		
		$(this.gridOptions.saveGridBtn).click(function(){			
			instance.saveGrid();
		}) 
	}
	//call init function
	this.gridOptions.onInit(this);
	
	return this;
}


// GRID Library
// Grid Helper functions


$.prototype.goToPage = function(grid, val) {
	grid.callPage(val);
}

$.prototype.getRowId = function(){
	return $(this).attr("id");
}


$.prototype.griddishTextBox = function(inputSelect, val) {
	$('.' + inputSelect, this).val(val);
}

$.prototype.griddishSelect = function(inputSelect, val) {
	$('.'+inputSelect + " option[value='" + val + "']", this).attr('selected','selected');
}

$.prototype.griddishLink = function(linkSelect, val) {
	$('.' + linkSelect, this).attr("href", val);
}

$.prototype.griddishCheck = function(checkBoxSelect) {
	$('.' + checkBoxSelect, this).attr("checked", true);
}
$.prototype.griddishUnCheck = function(checkBoxSelect) {
	$('.' + checkBoxSelect, this).attr("checked", false);
}

$.prototype.griddishText = function(tagSelect,val){
	$('.' + tagSelect, this).html(val);
}

$.prototype.griddishInput = function(tagSelect,val){
	$('.' + tagSelect, this).val(val);
}
$.prototype.griddishHidden = function(tagSelect,val){
	$('.' + tagSelect, this).val(val);
}


$.prototype.griddishDisable = function(tagSelect,val){
	$('.' + tagSelect, this).closest("td").addClass('disabledTag');
	$('.' + tagSelect, this).closest("td").addClass('disabledTag');	
}



$.prototype.griddishVal = function(inputSelect){
	if($('.' + inputSelect, this)!=undefined){
		var val = $('.' + inputSelect, this).val();
		if(val == "null" || val == ""){
			return null;
		}else{
			return val;
		}		 
	}else{
		return null;
	}	
}

$.prototype.griddishReadText = function(tagSelect){
	return $(tagSelect, this).text();
}

$.prototype.griddishChecked = function(checkBoxSelect){
	if($('.' + checkBoxSelect, this)!=undefined){
		return $('.' + checkBoxSelect, this).prop('checked')?true:false;
	}else{
		return false;
	}
	
}

$.prototype.griddishRadioChecked = function(checkBoxSelect){
	if($('.' + checkBoxSelect, this)!=undefined){
		return $('.' + checkBoxSelect+':checked', this).val();
	}else{
		return false;
	}
	
}

function statusCheckBox(checkbox) {
	checkbox.bootstrapToggle('destroy');
	checkbox.bootstrapToggle({
		on : 'ACTIVE',
		off : 'INACTIVE'
	});
}
function approvalCheckBox(checkbox) {
	checkbox.bootstrapToggle('destroy');
	checkbox.bootstrapToggle({
		on : 'APPROVED',
		off : 'PENDING'
	});
}

function approvalCheckBoxUpdate(checkbox){
	var prop = checkbox.attr("checked");
	if(prop == "true" || prop == true ||  prop == "checked"){
		checkbox.bootstrapToggle("on");
	}else{
		checkbox.bootstrapToggle("off");
	}
}